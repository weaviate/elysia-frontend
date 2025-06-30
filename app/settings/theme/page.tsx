export default function Home() {
  return (
    <div className="flex flex-col w-full h-screen overflow-hidden">
      <div className="flex w-full flex-col gap-2 min-h-0 items-center justify-start h-full fade-in">
        {/* Title */}
        <div className="flex mb-2 w-full justify-start">
          <p className="text-lg text-primary">Theme</p>
        </div>
        <div className="flex flex-col w-full md:w-[60vw] lg:w-[40vw] gap-6 h-full">
          <p>Theme</p>
        </div>
      </div>
    </div>
  );
}
