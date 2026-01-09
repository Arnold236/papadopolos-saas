import { notFound } from "next/navigation";
import { Calendar, User, Clock, Tag, Share2, Facebook, Twitter, Linkedin, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/utils";
import { BlogContent } from "@/components/blog/BlogContent";
import { RelatedPosts } from "@/components/blog/RelatedPosts";

async function getPost(slug: string) {
  const post = await prisma.blogPost.findUnique({
    where: { slug, published: true },
    include: {
      author: {
        include: {
          user: true,
        },
      },
      category: true,
      tags: true,
    },
  });

  if (!post) {
    notFound();
  }

  // Increment view count
  await prisma.blogPost.update({
    where: { id: post.id },
    data: { views: { increment: 1 } },
  });

  return post;
}

export default async function BlogPostPage({
  params,
}: {
  params: { slug: string };
}) {
  const post = await getPost(params.slug);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Image */}
      <div className="relative h-[60vh] max-h-[600px]">
        <img
          src={post.featuredImage || "/api/placeholder/1920/600"}
          alt={post.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
          <div className="max-w-4xl mx-auto">
            <Badge className="mb-4 bg-white text-[#00BFFF]">{post.category.name}</Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{post.title}</h1>
            <p className="text-xl opacity-90 mb-6">{post.excerpt}</p>
            
            <div className="flex flex-wrap items-center gap-6">
              <div className="flex items-center space-x-3">
                <Avatar>
                  <AvatarImage src={post.author?.user?.avatar} />
                  <AvatarFallback>
                    {post.author?.user?.name?.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold">{post.author?.user?.name}</p>
                  <p className="text-sm opacity-80">{post.author?.specialty}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-2" />
                  <span>{formatDate(post.publishedAt)}</span>
                </div>
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-2" />
                  <span>{post.readTime} min read</span>
                </div>
                <div className="flex items-center">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  <span>{post._count?.comments || 0} comments</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <article className="bg-white rounded-2xl shadow-lg p-8">
              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-8">
                {post.tags.map((tag) => (
                  <Badge key={tag.id} variant="secondary">
                    <Tag className="w-3 h-3 mr-1" />
                    {tag.name}
                  </Badge>
                ))}
              </div>

              {/* Content */}
              <BlogContent content={post.content} />

              {/* Share Buttons */}
              <div className="mt-12 pt-8 border-t">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold mb-2">Share this article</h4>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline">
                        <Facebook className="w-4 h-4 mr-2" />
                        Facebook
                      </Button>
                      <Button size="sm" variant="outline">
                        <Twitter className="w-4 h-4 mr-2" />
                        Twitter
                      </Button>
                      <Button size="sm" variant="outline">
                        <Linkedin className="w-4 h-4 mr-2" />
                        LinkedIn
                      </Button>
                    </div>
                  </div>
                  <Button variant="ghost">
                    <Share2 className="w-4 h-4 mr-2" />
                    Copy Link
                  </Button>
                </div>
              </div>

              {/* Author Bio */}
              <div className="mt-12 p-6 bg-gray-50 rounded-xl">
                <div className="flex items-start space-x-4">
                  <Avatar className="w-16 h-16">
                    <AvatarImage src={post.author?.user?.avatar} />
                    <AvatarFallback>
                      {post.author?.user?.name?.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="text-lg font-semibold mb-2">
                      About {post.author?.user?.name}
                    </h4>
                    <p className="text-gray-600 mb-3">{post.author?.bio}</p>
                    <div className="flex space-x-3">
                      <Button size="sm" variant="outline">
                        View Profile
                      </Button>
                      <Link href={`/specialists/${post.author?.id}`}>
                        <Button size="sm" variant="outline">
                          Book Appointment
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </article>

            {/* Comments Section */}
            <div className="mt-8 bg-white rounded-2xl shadow-lg p-8">
              <h3 className="text-2xl font-bold mb-6">
                Comments ({post._count?.comments || 0})
              </h3>
              {/* Comments component would go here */}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Related Articles */}
            <RelatedPosts categoryId={post.categoryId} currentPostId={post.id} />

            {/* Newsletter */}
            <div className="bg-gradient-to-br from-[#00BFFF] to-[#0099CC] text-white rounded-2xl p-6">
              <h4 className="text-xl font-bold mb-3">Stay Updated</h4>
              <p className="mb-4">
                Get the latest health tips and articles directly in your inbox
              </p>
              <form className="space-y-3">
                <input
                  type="email"
                  placeholder="Your email"
                  className="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder:text-white/70"
                />
                <Button className="w-full bg-white text-[#00BFFF] hover:bg-gray-100">
                  Subscribe
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}