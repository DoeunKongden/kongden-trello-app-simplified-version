"use client"

import { Board } from "@/types/board";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2, List } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { deleteBoard } from "@/lib/api/boards";
import { useToast } from "@/hooks/use-toast";
import { DeleteBoardDialog } from "./delete-board-dialog";

interface BoardCardProps {
  board: Board;
  onDelete: (id: string) => void;
}

export function BoardCard({ board, onDelete }: BoardCardProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const handleClick = () => {
    router.push(`/boards/${board.id}`);
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    setIsDeleting(true);
    try {
      await deleteBoard(board.id);
      onDelete(board.id);
      setIsDeleteDialogOpen(false);
      toast({
        title: "Board deleted",
        description: `"${board.title}" has been deleted successfully.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete board",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const backgroundColor = board.backgroundColor || "blue";
  const bgColorMap: Record<string, string> = {
    blue: "bg-blue-500",
    purple: "bg-purple-500",
    green: "bg-green-500",
    red: "bg-red-500",
    yellow: "bg-yellow-500",
    orange: "bg-orange-500",
    pink: "bg-pink-500",
    gray: "bg-gray-500",
  };

  return (
    <Card
      className="cursor-pointer transition-all hover:shadow-lg hover:scale-[1.02] relative overflow-hidden group"
      onClick={handleClick}
    >
      <div className={`h-2 ${bgColorMap[backgroundColor] || bgColorMap.blue}`} />
      <CardHeader>
        <CardTitle className="line-clamp-2">{board.title}</CardTitle>
        {board.description && (
          <CardDescription className="line-clamp-2">{board.description}</CardDescription>
        )}
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <List className="h-4 w-4" />
          <span>{board._count.lists} {board._count.lists === 1 ? "list" : "lists"}</span>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between items-center">
        <span className="text-xs text-muted-foreground">
          {new Date(board.updatedAt).toLocaleDateString()}
        </span>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleDeleteClick}
          disabled={isDeleting}
          className="opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <Trash2 className="h-4 w-4 text-destructive" />
        </Button>
      </CardFooter>

      <DeleteBoardDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        boardTitle={board.title}
        onConfirm={handleDeleteConfirm}
        isDeleting={isDeleting}
      />
    </Card>
  );
}
