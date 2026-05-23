export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 py-8 mt-16">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <p className="text-white font-bold text-lg mb-2">Beegeeservice</p>
        <p className="text-sm">&copy; {new Date().getFullYear()} Beegeeservice. All rights reserved.</p>
      </div>
    </footer>
  );
}
