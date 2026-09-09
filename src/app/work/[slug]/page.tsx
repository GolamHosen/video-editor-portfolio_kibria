import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { connectToDatabase } from "@/lib/mongodb";
import { Project, Category, Media } from "@/models";
import { ProjectDetailClient } from "@/components/project/ProjectDetailClient";
import { PageTransition } from "@/components/animation";

interface ProjectPageProps {
  params: Promise<{ slug: string }>;
}

export const dynamic = "force-dynamic";

async function getProject(slug: string) {
  try {
    await connectToDatabase();
    const proj = await Project.findOne({ slug, status: "published" }).lean();
    if (proj) {
      let categoryName: string | null = null;
      let categorySlug: string | null = null;

      if (proj.categoryId) {
        const cat = await Category.findOne({ id: proj.categoryId }).lean();
        if (cat) {
          categoryName = cat.name;
          categorySlug = cat.slug;
        }
      }

      return {
        id: proj.id,
        title: proj.title,
        slug: proj.slug,
        description: proj.description || null,
        shortDescription: proj.shortDescription || null,
        client: proj.client || null,
        year: proj.year || null,
        role: proj.role || null,
        tools: proj.tools || [],
        featured: proj.featured || false,
        thumbnailUrl: proj.thumbnailUrl || null,
        videoUrl: proj.videoUrl || null,
        videoPosterUrl: proj.videoPosterUrl || null,
        liveUrl: proj.liveUrl || null,
        tags: proj.tags || [],
        createdAt: proj.createdAt,
        updatedAt: proj.updatedAt,
        categoryId: proj.categoryId || null,
        categoryName,
        categorySlug,
      };
    }
  } catch {
    // Database offline
  }

  return null;
}

async function getProjectMedia(projectId: number) {
  try {
    await connectToDatabase();
    const items = await Media.find({ projectId }).sort({ order: 1 }).lean();
    return items.map((m) => ({
      id: m.id,
      type: m.type,
      url: m.url,
      thumbnailUrl: m.thumbnailUrl || null,
      altText: m.altText || null,
      width: m.width || null,
      height: m.height || null,
    }));
  } catch {
    return [];
  }
}

async function getAdjacentProjects(currentId: number) {
  try {
    await connectToDatabase();
    const items = await Project.find({ status: "published", id: { $ne: currentId } })
      .sort({ order: 1, createdAt: -1 })
      .limit(2)
      .lean();
    return items.map((p) => ({
      id: p.id,
      title: p.title,
      slug: p.slug,
      thumbnailUrl: p.thumbnailUrl || null,
    }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProject(slug);

  if (!project) {
    return { title: "Project Not Found" };
  }

  return {
    title: project.title,
    description: project.shortDescription || project.description || "",
    openGraph: {
      title: `${project.title} | VisualCraft`,
      description: project.shortDescription || project.description || "",
      images: project.thumbnailUrl ? [{ url: project.thumbnailUrl }] : [],
    },
    twitter: {
      card: "summary_large_image",
      title: `${project.title} | VisualCraft`,
      description: project.shortDescription || project.description || "",
      images: project.thumbnailUrl ? [project.thumbnailUrl] : [],
    },
  };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = await getProject(slug);

  if (!project) {
    notFound();
  }

  const [projectMedia, adjacentProjects] = await Promise.all([
    getProjectMedia(project.id),
    getAdjacentProjects(project.id),
  ]);

  const projectWithMedia = {
    ...project,
    tools: project.tools ?? [],
    tags: project.tags ?? [],
    media: projectMedia,
  };

  return (
    <PageTransition>
      <ProjectDetailClient
        project={projectWithMedia}
        adjacentProjects={adjacentProjects}
      />
    </PageTransition>
  );
}
