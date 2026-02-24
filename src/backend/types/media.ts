/**
 * Media Asset Types
 * Shared type definitions for media gallery and upload functionality
 */

export interface MediaAsset {
  id: number;
  url: string;
  name: string;
  type: string;
  size: string;
}

export interface MediaGalleryProps {
  onSelect: (asset: MediaAsset) => void;
  selectedId: number | null;
}

export interface MediaSidebarProps {
  asset: MediaAsset | null;
  onClose: () => void;
}
