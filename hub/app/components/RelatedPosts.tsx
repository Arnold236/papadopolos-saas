import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar } from "lucide-react";
import { formatDate } from "@/lib/utils";

interface RelatedPostsProps {
  categoryId: string;
  currentPostId: string;
}

export async function RelatedPosts({ categoryId, currentPostId }: RelatedPostsProps) {
  const relatedPosts = await prisma.blogPost.findMany({
    where: {
      categoryId,
      published: true,
      id: { not: currentPostId },
    },
    include: {
      author: {
        include: { user: true },
      },
    },
    orderBy: { publishedAt: "desc" },
    take: 3,
  });

  if (relatedPosts.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <h4 className="font-semibold text-lg mb-4">Related Articles</h4>
        <div className="space-y-4">
          {relatedPosts.map((post) => (
            <Link
              key={post.id}
              href={`/blog/${post.slug}`}
              className="block group"
            >
              <div className="flex items-start space-x-3">
                <div className="w-16 h-16 flex-shrink-0 rounded overflow-hidden">
                  <img
                    src={post.featuredImage || "/api/placeholder/64/64"}
                    alt={post.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h5 className="font-medium group-hover:text-[#00BFFF] transition-colors line-clamp-2">
                    {post.title}
                  </h5>
                  <div className="flex items-center text-sm text-gray-500 mt-1">
                    <Calendar className="w-3 h-3 mr-1" />
                    {formatDate(post.publishedAt)}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}