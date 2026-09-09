import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { Comment, Project } from "@/models";
import { z } from "zod";

export const dynamic = "force-dynamic";

const createCommentSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  role: z.string().max(100).optional(),
  rating: z.number().int().min(1, "Rating must be at least 1 star").max(5, "Rating cannot exceed 5 stars"),
  comment: z.string().min(2, "Comment must be at least 2 characters").max(2000, "Comment cannot exceed 2000 characters"),
});

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    await connectToDatabase();

    const comments = await Comment.find({
      projectSlug: slug,
      status: "approved",
    })
      .sort({ createdAt: -1 })
      .lean();

    const totalReviews = comments.length;
    const sumRatings = comments.reduce((acc, curr) => acc + (curr.rating || 5), 0);
    const averageRating = totalReviews > 0 ? parseFloat((sumRatings / totalReviews).toFixed(1)) : 5.0;

    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    comments.forEach((c) => {
      const r = Math.min(5, Math.max(1, Math.round(c.rating || 5))) as 1 | 2 | 3 | 4 | 5;
      distribution[r] = (distribution[r] || 0) + 1;
    });

    const formatted = comments.map((c) => ({
      id: c.id,
      projectId: c.projectId,
      projectSlug: c.projectSlug,
      projectTitle: c.projectTitle,
      name: c.name,
      role: c.role || null,
      rating: c.rating,
      comment: c.comment,
      createdAt: c.createdAt,
    }));

    return NextResponse.json({
      data: formatted,
      stats: {
        totalReviews,
        averageRating,
        distribution,
      },
    });
  } catch (error) {
    console.error("GET /api/projects/[slug]/comments error:", error);
    return NextResponse.json(
      { error: "Failed to fetch comments" },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const body = await request.json();

    const parsed = createCommentSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    await connectToDatabase();

    // Verify project exists
    const project = await Project.findOne({ slug }).lean();
    if (!project) {
      return NextResponse.json(
        { error: "Project not found" },
        { status: 404 }
      );
    }

    // Generate unique ID
    const maxComment = await Comment.findOne({}).sort({ id: -1 }).lean();
    const nextId = maxComment && maxComment.id ? maxComment.id + 1 : 1;

    const newComment = await Comment.create({
      id: nextId,
      projectId: project.id,
      projectSlug: project.slug,
      projectTitle: project.title,
      name: parsed.data.name.trim(),
      role: parsed.data.role ? parsed.data.role.trim() : null,
      rating: parsed.data.rating,
      comment: parsed.data.comment.trim(),
      status: "approved",
      createdAt: new Date(),
    });

    return NextResponse.json(
      {
        data: {
          id: newComment.id,
          projectId: newComment.projectId,
          projectSlug: newComment.projectSlug,
          projectTitle: newComment.projectTitle,
          name: newComment.name,
          role: newComment.role || null,
          rating: newComment.rating,
          comment: newComment.comment,
          createdAt: newComment.createdAt,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/projects/[slug]/comments error:", error);
    return NextResponse.json(
      { error: "Failed to submit comment" },
      { status: 500 }
    );
  }
}
