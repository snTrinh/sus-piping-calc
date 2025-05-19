import Sidebar from "../components/Sidebar";
import B31_3Calculator from "../components/b31_3/B31_3Calculator";
import PdfExport from "../components/b31_3/PdfExport";

export default function HomePage() {
  return (
    <main className="font-sans flex flex-col justify-center">
      <B31_3Calculator />
    </main>
  );
}
