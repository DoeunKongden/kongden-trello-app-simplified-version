"use client"

import { useState, useMemo } from "react";
import { Board } from "@/types/board";
import { BoardGrid } from "./board-grid";
import { CreateBoardDialog } from "./create-board-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search } from "lucide-react";
import { getBoards } from "@/lib/api/boards";
import { useToast } from "@/hooks/use-toast";

interface DashboardClientProps {
  initialBoards: Board[];
}

export function DashboardClient({ initialBoards }: DashboardClientProps) {
  const { toast } = useToast();
  const [boards, setBoards] = useState<Board[]>(initialBoards);
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const filteredBoards = useMemo(() => {
    if (!searchQuery.trim()) return boards;
    const query = searchQuery.toLowerCase();
    return boards.filter(
      (board) =>
        board.title.toLowerCase().includes(query) ||
        (board.description && board.description.toLowerCase().includes(query))
    );
  }, [boards, searchQuery]);

  const handleCreateSuccess = (newBoard: Board) => {
    setBoards((prev) => [newBoard, ...prev]);
  };

  const handleDelete = (id: string) => {
    setBoards((prev) => prev.filter((board) => board.id !== id));
  };

  const handleRefresh = async () => {
    setIsLoading(true);
    try {
      const updatedBoards = await getBoards();
      setBoards(updatedBoards);
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to refresh boards",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">My Boards</h1>
          <p className="text-muted-foreground mt-1">
            Manage your boards and organize your tasks
          </p>
        </div>
        <Button onClick={() => setIsCreateDialogOpen(true)} size="lg">
          <Plus className="h-4 w-4 mr-2" />
          Create Board
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search boards by title or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        {searchQuery && (
          <Button
            variant="outline"
            onClick={() => setSearchQuery("")}
          >
            Clear
          </Button>
        )}
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <div className="text-muted-foreground">Loading...</div>
        </div>
      ) : (
        <BoardGrid
          boards={filteredBoards}
          onDelete={handleDelete}
          onCreateClick={() => setIsCreateDialogOpen(true)}
        />
      )}

      <CreateBoardDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onSuccess={handleCreateSuccess}
      />
    </div>
  );
}
