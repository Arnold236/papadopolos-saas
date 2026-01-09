"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { 
  Save, 
  Upload, 
  Eye, 
  X, 
  Bold, 
  Italic, 
  List, 
  Link,
  Image as ImageIcon,
  Heading
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";
import { FileUpload } from "@/components/FileUpload";

const blogSchema = z.object({
  title: z.string().min(10, "Title must be at least 10 characters"),
  excerpt: z.string().min(50, "Excerpt must be at least 50 characters"),
  content: z.string().min(100, "Content must be at least 100 characters"),
  categoryId: z.string().min(1, "Please select a category"),
  featuredImage: z.string().url("Please upload a featured image"),
  readTime: z.number().min(1, "Read time must be at least 1 minute"),
  tags: z.array(z.string()).min(1, "Add at least one tag"),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  published: z.boolean().default(false),
});

export default function CreateBlogPage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [categories, setCategories] = useState([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm({
    resolver: zodResolver(blogSchema),
    defaultValues: {
      title: "",
      excerpt: "",
      content: "",
      categoryId: "",
      featuredImage: "",
      readTime: 5,
      tags: [],
      metaTitle: "",
      metaDescription: "",
      published: false,
    },
  });

  const content = watch("content");
  const featuredImage = watch("featuredImage");

  useEffect(() => {
    if (isLoaded && !user) {
      router.push("/sign-in");
    }
  }, [isLoaded, user, router]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    const res = await fetch("/api/blog/categories");
    const data = await res.json();
    setCategories(data);
  };

  const addTag = () => {
    if (tagInput.trim() && !selectedTags.includes(tagInput.trim())) {
      const newTags = [...selectedTags, tagInput.trim()];
      setSelectedTags(newTags);
      setValue("tags", newTags);
      setTagInput("");
    }
  };

  const removeTag = (tag: string) => {
    const newTags = selectedTags.filter(t => t !== tag);
    setSelectedTags(newTags);
    setValue("tags", newTags);
  };

  const handleImageUpload = (urls: string[]) => {
    if (urls[0]) {
      setValue("featuredImage", urls[0]);
    }
  };

  const insertFormat = (format: string) => {
    const textarea = document.getElementById("content") as HTMLTextAreaElement;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);
    
    let formattedText = "";
    switch (format) {
      case "bold":
        formattedText = `**${selectedText}**`;
        break;
      case "italic":
        formattedText = `*${selectedText}*`;
        break;
      case "heading":
        formattedText = `## ${selectedText}`;
        break;
      case "list":
        formattedText = `\n- ${selectedText}\n`;
        break;
      case "link":
        formattedText = `[${selectedText}](url)`;
        break;
    }
    
    const newContent = content.substring(0, start) + formattedText + content.substring(end);
    setValue("content", newContent);
  };

  const onSubmit = async (data: any) => {
    setLoading(true);
    try {
      const response = await fetch("/api/blog", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: data.published 
            ? "Blog post published successfully!" 
            : "Draft saved successfully!",
        });
        router.push("/blog");
      } else {
        throw new Error("Failed to save post");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save blog post. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!isLoaded || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00BFFF]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Create Blog Post</h1>
            <p className="text-gray-600">Share your healthcare expertise with our community</p>
          </div>
          <div className="flex space-x-3">
            <Button
              variant="outline"
              onClick={() => setPreviewMode(!previewMode)}
            >
              <Eye className="w-4 h-4 mr-2" />
              {previewMode ? "Edit" : "Preview"}
            </Button>
            <Button
              onClick={() => setValue("published", true)}
              disabled={loading}
            >
              <Save className="w-4 h-4 mr-2" />
              {loading ? "Publishing..." : "Publish"}
            </Button>
          </div>
        </div>

        <Tabs defaultValue="content" className="space-y-6">
          <TabsList>
            <TabsTrigger value="content">Content</TabsTrigger>
            <TabsTrigger value="media">Media</TabsTrigger>
            <TabsTrigger value="seo">SEO</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <form onSubmit={handleSubmit(onSubmit)}>
            <TabsContent value="content" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                  {/* Title */}
                  <div>
                    <Label htmlFor="title">Title *</Label>
                    <Input
                      id="title"
                      {...register("title")}
                      placeholder="Enter a compelling title..."
                      className="text-2xl font-bold h-16"
                    />
                    {errors.title && (
                      <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
                    )}
                  </div>

                  {/* Excerpt */}
                  <div>
                    <Label htmlFor="excerpt">Excerpt *</Label>
                    <Textarea
                      id="excerpt"
                      {...register("excerpt")}
                      placeholder="Brief summary of your article..."
                      rows={3}
                    />
                    {errors.excerpt && (
                      <p className="text-red-500 text-sm mt-1">{errors.excerpt.message}</p>
                    )}
                  </div>

                  {/* Content Editor */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <Label>Content *</Label>
                      <div className="flex space-x-1">
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => insertFormat("bold")}
                        >
                          <Bold className="w-4 h-4" />
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => insertFormat("italic")}
                        >
                          <Italic className="w-4 h-4" />
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => insertFormat("heading")}
                        >
                          <Heading className="w-4 h-4" />
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => insertFormat("list")}
                        >
                          <List className="w-4 h-4" />
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => insertFormat("link")}
                        >
                          <Link className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    
                    {previewMode ? (
                      <Card className="p-6">
                        {/* Preview content would be rendered here */}
                        <div className="prose max-w-none">
                          Preview content
                        </div>
                      </Card>
                    ) : (
                      <>
                        <Textarea
                          id="content"
                          {...register("content")}
                          placeholder="Write your article here... (Markdown supported)"
                          rows={20}
                          className="font-mono"
                        />
                        {errors.content && (
                          <p className="text-red-500 text-sm mt-1">{errors.content.message}</p>
                        )}
                      </>
                    )}
                  </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                  {/* Featured Image */}
                  <Card>
                    <CardContent className="pt-6">
                      <Label className="block mb-3">Featured Image</Label>
                      {featuredImage ? (
                        <div className="space-y-3">
                          <div className="aspect-video rounded-lg overflow-hidden">
                            <img
                              src={featuredImage}
                              alt="Featured"
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            onClick={() => setValue("featuredImage", "")}
                          >
                            <X className="w-4 h-4 mr-2" />
                            Remove Image
                          </Button>
                        </div>
                      ) : (
                        <FileUpload
                          endpoint="doctorGallery"
                          onUploadComplete={handleImageUpload}
                          maxFiles={1}
                        />
                      )}
                      {errors.featuredImage && (
                        <p className="text-red-500 text-sm mt-1">{errors.featuredImage.message}</p>
                      )}
                    </CardContent>
                  </Card>

                  {/* Category */}
                  <Card>
                    <CardContent className="pt-6">
                      <Label htmlFor="category">Category *</Label>
                      <Select onValueChange={(value) => setValue("categoryId", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((category: any) => (
                            <SelectItem key={category.id} value={category.id}>
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.categoryId && (
                        <p className="text-red-500 text-sm mt-1">{errors.categoryId.message}</p>
                      )}
                    </CardContent>
                  </Card>

                  {/* Tags */}
                  <Card>
                    <CardContent className="pt-6">
                      <Label htmlFor="tags">Tags</Label>
                      <div className="space-y-3">
                        <div className="flex space-x-2">
                          <Input
                            value={tagInput}
                            onChange={(e) => setTagInput(e.target.value)}
                            placeholder="Add a tag"
                            onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                          />
                          <Button type="button" onClick={addTag}>Add</Button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {selectedTags.map((tag) => (
                            <Badge key={tag} variant="secondary" className="pl-2 pr-1">
                              {tag}
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="h-4 w-4 p-0 ml-1"
                                onClick={() => removeTag(tag)}
                              >
                                <X className="w-3 h-3" />
                              </Button>
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Read Time */}
                  <Card>
                    <CardContent className="pt-6">
                      <Label htmlFor="readTime">Read Time (minutes) *</Label>
                      <Input
                        id="readTime"
                        type="number"
                        min="1"
                        {...register("readTime", { valueAsNumber: true })}
                      />
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            {/* Other tabs content would go here */}
          </form>
        </Tabs>
      </div>
    </div>
  );
}