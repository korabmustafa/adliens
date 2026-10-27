import { ProjectWorkspace } from "../components/ProjectWorkspace";
export function WorkPage() {
  return (
    <div className="universe-page">
      <header className="page-intro">
        <p className="eyebrow">OUR WORK / YOUR NEXT POSSIBILITY</p>
        <h1>
          Ideas made <em>real.</em>
        </h1>
        <p>
          Open a client world. Discover the thinking, the craft, and the work.
        </p>
      </header>
      <ProjectWorkspace />
    </div>
  );
}
