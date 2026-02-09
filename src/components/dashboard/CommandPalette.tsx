"use client";

import { useEffect, useState } from "react";
import { Command } from "cmdk";
import {
  FileText,
  Upload,
  Send,
  Settings,
  Users,
  BarChart3,
  Search,
  Plus,
  Calendar,
  Tag,
  Image as ImageIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const router = useRouter();

  // Toggle on ⌘K or Ctrl+K
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  // Handle command selection
  const handleSelect = (callback: () => void) => {
    callback();
    setOpen(false);
  };

  return (
    <>
      {/* Keyboard Hint Button */}
      <button
        onClick={() => setOpen(true)}
        className="hidden md:flex items-center gap-2 px-3 py-1.5 text-sm text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
      >
        <Search className="w-4 h-4" />
        <span>Search</span>
        <kbd className="px-2 py-0.5 text-xs font-semibold text-gray-800 bg-white border border-gray-200 rounded">
          ⌘K
        </kbd>
      </button>

      {/* Command Palette Modal */}
      <Command.Dialog
        open={open}
        onOpenChange={setOpen}
        label="Global Command Menu"
        className="fixed inset-0 z-50"
      >
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        />

        {/* Command Panel */}
        <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl">
          <Command className="bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden">
            {/* Search Input */}
            <div className="flex items-center border-b border-gray-200 px-4">
              <Search className="w-5 h-5 text-gray-400 shrink-0" />
              <Command.Input
                value={search}
                onValueChange={setSearch}
                placeholder="Type a command or search..."
                className="w-full px-4 py-4 text-lg outline-none placeholder-gray-400"
              />
            </div>

            {/* Command List */}
            <Command.List className="max-h-[400px] overflow-y-auto p-2">
              {/* Empty State */}
              <Command.Empty className="py-6 text-center text-sm text-gray-500">
                No results found for &ldquo;{search}&rdquo;
              </Command.Empty>

              {/* Quick Actions Group */}
              <Command.Group heading="Quick Actions" className="px-2 py-2">
                <Command.Item
                  onSelect={() =>
                    handleSelect(() =>
                      router.push("/admin/dashboard/articles/new"),
                    )
                  }
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors aria-selected:bg-blue-50 aria-selected:text-blue-600"
                >
                  <Plus className="w-5 h-5" />
                  <div className="flex-1">
                    <p className="font-medium">Create New Article</p>
                    <p className="text-xs text-gray-500">
                      Start writing a new story
                    </p>
                  </div>
                  <kbd className="px-2 py-1 text-xs bg-gray-200 rounded">N</kbd>
                </Command.Item>

                <Command.Item
                  onSelect={() =>
                    handleSelect(() => {
                      /* Publish logic */
                    })
                  }
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors aria-selected:bg-blue-50 aria-selected:text-blue-600"
                >
                  <Send className="w-5 h-5" />
                  <div className="flex-1">
                    <p className="font-medium">Publish Article</p>
                    <p className="text-xs text-gray-500">
                      Make current draft live
                    </p>
                  </div>
                  <kbd className="px-2 py-1 text-xs bg-gray-200 rounded">⌘</kbd>
                  <kbd className="px-2 py-1 text-xs bg-gray-200 rounded">P</kbd>
                </Command.Item>

                <Command.Item
                  onSelect={() =>
                    handleSelect(() => {
                      /* Upload logic */
                    })
                  }
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors aria-selected:bg-blue-50 aria-selected:text-blue-600"
                >
                  <Upload className="w-5 h-5" />
                  <div className="flex-1">
                    <p className="font-medium">Upload Media</p>
                    <p className="text-xs text-gray-500">
                      Images, videos, or documents
                    </p>
                  </div>
                </Command.Item>

                <Command.Item
                  onSelect={() =>
                    handleSelect(() => router.push("/admin/dashboard/media"))
                  }
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors aria-selected:bg-blue-50 aria-selected:text-blue-600"
                >
                  <ImageIcon className="w-5 h-5" />
                  <div className="flex-1">
                    <p className="font-medium">Media Library</p>
                    <p className="text-xs text-gray-500">
                      Browse uploaded files
                    </p>
                  </div>
                </Command.Item>
              </Command.Group>

              {/* Navigation Group */}
              <Command.Group heading="Navigate" className="px-2 py-2">
                <Command.Item
                  onSelect={() =>
                    handleSelect(() => router.push("/admin/dashboard"))
                  }
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors aria-selected:bg-blue-50 aria-selected:text-blue-600"
                >
                  <BarChart3 className="w-5 h-5" />
                  <span>Dashboard</span>
                </Command.Item>

                <Command.Item
                  onSelect={() =>
                    handleSelect(() => router.push("/admin/dashboard/articles"))
                  }
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors aria-selected:bg-blue-50 aria-selected:text-blue-600"
                >
                  <FileText className="w-5 h-5" />
                  <span>All Articles</span>
                </Command.Item>

                <Command.Item
                  onSelect={() =>
                    handleSelect(() => router.push("/admin/dashboard/team"))
                  }
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors aria-selected:bg-blue-50 aria-selected:text-blue-600"
                >
                  <Users className="w-5 h-5" />
                  <span>Team Members</span>
                </Command.Item>

                <Command.Item
                  onSelect={() =>
                    handleSelect(() => router.push("/admin/dashboard/settings"))
                  }
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors aria-selected:bg-blue-50 aria-selected:text-blue-600"
                >
                  <Settings className="w-5 h-5" />
                  <span>Settings</span>
                </Command.Item>
              </Command.Group>

              {/* Filters Group */}
              <Command.Group heading="Filters" className="px-2 py-2">
                <Command.Item
                  onSelect={() =>
                    handleSelect(() => {
                      /* Filter by category */
                    })
                  }
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors aria-selected:bg-blue-50 aria-selected:text-blue-600"
                >
                  <Tag className="w-5 h-5" />
                  <span>Filter by Category</span>
                </Command.Item>

                <Command.Item
                  onSelect={() =>
                    handleSelect(() => {
                      /* Filter by date */
                    })
                  }
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors aria-selected:bg-blue-50 aria-selected:text-blue-600"
                >
                  <Calendar className="w-5 h-5" />
                  <span>Filter by Date</span>
                </Command.Item>
              </Command.Group>
            </Command.List>

            {/* Footer Tips */}
            <div className="border-t border-gray-200 px-4 py-2 flex items-center gap-4 text-xs text-gray-500">
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 bg-gray-100 rounded">↑↓</kbd>
                Navigate
              </span>
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 bg-gray-100 rounded">Enter</kbd>
                Select
              </span>
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 bg-gray-100 rounded">Esc</kbd>
                Close
              </span>
            </div>
          </Command>
        </div>
      </Command.Dialog>
    </>
  );
}
