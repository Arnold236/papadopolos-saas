import { Suspense } from "react";
import { Search, Calendar, User, Tag, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/utils";

async function getBlogPosts(category?: string, search?: string) {
  return await prisma.blogPost.findMany({
    where: {
      published: true,
      ...(category && { category: { slug: category } }),
      ...(search && {
        OR: [
          { title: { contains: search, mode: "insensitive" } },
          { content: { contains: search, mode: "insensitive" } },
          { excerpt: { contains: search, mode: "insensitive" } },
        ],
      }),
    },
    include: {
      author: {
        include: {
          user: true,
        },
      },
      category: true,
      tags: true,
    },
    orderBy: {
      publishedAt: "desc",
    },
    take: 12,
  });
}

async function getCategories() {
  return await prisma.blogCategory.findMany({
    orderBy: { name: "asc" },
  });
}

async function getFeaturedPosts() {
  return await prisma.blogPost.findMany({
    where: {
      published: true,
      featured: true,
    },
    include: {
      author: {
        include: {
          user: true,
        },
      },
      category: true,
    },
    orderBy: {
      publishedAt: "desc",
    },
    take: 3,
  });
}

export default async function BlogPage({
  searchParams,
}: {
  searchParams: { category?: string; search?: string };
}) {
  const [posts, categories, featured] = await Promise.all([
    getBlogPosts(searchParams.category, searchParams.search),
    getCategories(),
    getFeaturedPosts(),
  ]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-[#00BFFF] to-[#0099CC] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold mb-6">Healthcare Blog</h1>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Expert insights, health tips, and medical advice from our team of healthcare professionals
          </p>
          
          {/* Search Bar */}
          <form action="/blog" method="GET" className="max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="search"
                name="search"
                placeholder="Search articles on health, wellness, treatments..."
                className="pl-12 pr-4 py-3 w-full rounded-full border-none shadow-lg"
              />
              <Button
                type="submit"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white text-[#00BFFF] hover:bg-gray-100"
              >
                Search
              </Button>
            </div>
          </form>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-8">
            {/* Categories */}
            <Card>
              <CardHeader>
                <h3 className="font-semibold text-lg">Categories</h3>
              </CardHeader>
              <CardContent className="space-y-2">
                <Link href="/blog">
                  <Button
                    variant={!searchParams.category ? "default" : "ghost"}
                    className="w-full justify-start"
                  >
                    All Articles
                  </Button>
                </Link>
                {categories.map((category) => (
                  <Link key={category.id} href={`/blog?category=${category.slug}`}>
                    <Button
                      variant={searchParams.category === category.slug ? "default" : "ghost"}
                      className="w-full justify-start"
                    >
                      {category.name} ({category._count?.posts || 0})
                    </Button>
                  </Link>
                ))}
              </CardContent>
            </Card>

            {/* Featured Posts */}
            <Card>
              <CardHeader>
                <h3 className="font-semibold text-lg">Featured Articles</h3>
              </CardHeader>
              <CardContent className="space-y-4">
                {featured.map((post) => (
                  <Link
                    key={post.id}
                    href={`/blog/${post.slug}`}
                    className="block group"
                  >
                    <div className="space-y-2">
                      <h4 className="font-medium group-hover:text-[#00BFFF] transition-colors line-clamp-2">
                        {post.title}
                      </h4>
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar className="w-3 h-3 mr-1" />
                        {formatDate(post.publishedAt)}
                      </div>
                    </div>
                  </Link>
                ))}
              </CardContent>
            </Card>

            {/* Newsletter Signup */}
            <Card className="bg-gradient-to-br from-[#00BFFF] to-[#0099CC] text-white">
              <CardHeader>
                <h3 className="font-semibold text-lg">Health Tips Newsletter</h3>
              </CardHeader>
              <CardContent>
                <p className="text-sm mb-4">
                  Get weekly health tips and updates from our specialists
                </p>
                <form className="space-y-3">
                  <Input
                    type="email"
                    placeholder="Your email"
                    className="bg-white/20 border-white/30 text-white placeholder:text-white/70"
                  />
                  <Button className="w-full bg-white text-[#00BFFF] hover:bg-gray-100">
                    Subscribe
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Featured Banner */}
            {featured[0] && (
              <Card className="mb-8 overflow-hidden border-0 shadow-xl">
                <div className="md:flex">
                  <div className="md:w-2/3 p-8">
                    <Badge className="mb-4 bg-[#00BFFF]">Featured</Badge>
                    <Link href={`/blog/${featured[0].slug}`}>
                      <h2 className="text-3xl font-bold mb-4 hover:text-[#00BFFF] transition-colors">
                        {featured[0].title}
                      </h2>
                    </Link>
                    <p className="text-gray-600 mb-6 line-clamp-3">
                      {featured[0].excerpt}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Avatar>
                          <AvatarImage src={featured[0].author?.user?.avatar} />
                          <AvatarFallback>
                            {featured[0].author?.user?.name?.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{featured[0].author?.user?.name}</p>
                          <p className="text-sm text-gray-500">
                            {featured[0].author?.specialty}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center text-gray-500">
                        <Clock className="w-4 h-4 mr-1" />
                        <span className="text-sm">{featured[0].readTime} min read</span>
                      </div>
                    </div>
                  </div>
                  <div className="md:w-1/3 relative min-h-[300px]">
                    <img
                      src={featured[0].featuredImage || "/api/placeholder/400/300"}
                      alt={featured[0].title}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  </div>
                </div>
              </Card>
            )}

            {/* Blog Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post) => (
                <Card
                  key={post.id}
                  className="group hover:shadow-xl transition-shadow overflow-hidden"
                >
                  <Link href={`/blog/${post.slug}`}>
                    <div className="aspect-video overflow-hidden">
                      <img
                        src={post.featuredImage || "/api/placeholder/400/225"}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <CardHeader>
                      <div className="flex items-center justify-between mb-2">
                        <Badge variant="outline">{post.category.name}</Badge>
                        <span className="text-sm text-gray-500">
                          {formatDate(post.publishedAt)}
                        </span>
                      </div>
                      <h3 className="text-xl font-semibold group-hover:text-[#00BFFF] transition-colors line-clamp-2">
                        {post.title}
                      </h3>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 line-clamp-3 mb-4">
                        {post.excerpt}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {post.tags.slice(0, 3).map((tag) => (
                          <Badge
                            key={tag.id}
                            variant="secondary"
                            className="text-xs"
                          >
                            {tag.name}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                    <CardFooter className="border-t pt-4">
                      <div className="flex items-center space-x-3">
                        <Avatar className="w-8 h-8">
                          <AvatarImage src={post.author?.user?.avatar} />
                          <AvatarFallback>
                            {post.author?.user?.name?.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium">{post.author?.user?.name}</p>
                          <p className="text-xs text-gray-500">
                            {post.author?.specialty}
                          </p>
                        </div>
                      </div>
                    </CardFooter>
                  </Link>
                </Card>
              ))}
            </div>

            {/* Empty State */}
            {posts.length === 0 && (
              <div className="text-center py-16">
                <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                  <Search className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-2xl font-semibold mb-3">No articles found</h3>
                <p className="text-gray-600 max-w-md mx-auto mb-6">
                  Try different search terms or browse our categories
                </p>
                <Link href="/blog">
                  <Button>View All Articles</Button>
                </Link>
              </div>
            )}

            {/* Load More */}
            {posts.length > 0 && (
              <div className="text-center mt-12">
                <Button variant="outline" size="lg">
                  Load More Articles
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}