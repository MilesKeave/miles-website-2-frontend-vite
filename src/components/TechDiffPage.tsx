export const TechDiffPage = (): React.JSX.Element => {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-center space-y-6">
        <h1 className="text-4xl font-bold text-white">Tech Diff</h1>
        <p className="text-gray-300 text-lg">
          Backend connectivity issues detected.
        </p>
        <p className="text-gray-400">
          Please check your network connection or try again later.
        </p>
      </div>
    </div>
  );
}; 