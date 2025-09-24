import { FocusCards } from "@/components/ui/focus-cards";
import { usePhotography } from "../hooks/usePhotography";

export function PhotographyPage() {
  const { photoFolders, loading, error } = usePhotography();

  // Convert photo folders to focus cards format
  const cards = photoFolders.map(folder => ({
    title: folder.name,
    src: folder.mainImageUrl,
  }));

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl">Loading photography...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-red-500 text-xl">Error loading photography: {error}</div>
      </div>
    );
  }

  // Show message if no photo folders exist
  if (cards.length === 0) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl text-center">
          <h1 className="text-4xl font-bold mb-4">My Photography</h1>
          <p>No photo folders found. Upload some photos via Postman to see them here!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-white text-center mb-8">My Photography</h1>
        <FocusCards cards={cards} />
      </div>
    </div>
  );
}
