import { Link } from "wouter";
import { Star, Users, Clock, PlayCircle } from "lucide-react";
import { Course } from "@workspace/api-client-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface CourseCardProps {
  course: Course;
}

export function CourseCard({ course }: CourseCardProps) {
  return (
    <Link href={`/courses/${course.id}`}>
      <Card className="overflow-hidden transition-all hover:shadow-md hover:-translate-y-1 cursor-pointer group">
        <div className="relative aspect-video w-full overflow-hidden bg-muted">
          {course.thumbnailUrl ? (
            <img 
              src={course.thumbnailUrl} 
              alt={course.titleBn} 
              className="object-cover w-full h-full transition-transform group-hover:scale-105"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-primary/10">
              <PlayCircle className="w-12 h-12 text-primary/40" />
            </div>
          )}
          {course.isFeatured && (
            <Badge className="absolute top-2 left-2 bg-accent text-accent-foreground border-none">
              Featured
            </Badge>
          )}
          <Badge className="absolute top-2 right-2 bg-background/80 backdrop-blur-sm text-foreground border-none">
            {course.level}
          </Badge>
        </div>
        
        <CardContent className="p-4 space-y-2">
          <div className="flex justify-between items-start gap-2">
            <span className="text-xs font-medium text-muted-foreground px-2 py-1 bg-muted rounded-md">
              {course.category}
            </span>
            <div className="flex items-center gap-1 text-amber-500 text-sm font-medium">
              <Star className="w-3.5 h-3.5 fill-current" />
              <span>{course.rating.toFixed(1)}</span>
            </div>
          </div>
          
          <div>
            <h3 className="font-bold text-lg leading-tight line-clamp-2 group-hover:text-primary transition-colors">
              {course.titleBn}
            </h3>
            <p className="text-xs text-muted-foreground mt-1 truncate">
              {course.titleEn}
            </p>
          </div>
          
          <div className="text-sm text-muted-foreground pt-2">
            By {course.instructor}
          </div>
        </CardContent>
        
        <CardFooter className="p-4 pt-0 flex items-center justify-between">
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Users className="w-3.5 h-3.5" />
              <span>{course.enrolledCount}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              <span>{course.totalLessons} পাঠ</span>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {course.originalPrice && course.originalPrice > course.price && (
              <span className="text-xs text-muted-foreground line-through">
                ৳{course.originalPrice}
              </span>
            )}
            <span className="font-bold text-primary">
              {course.price === 0 ? "Free" : `৳${course.price}`}
            </span>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}
