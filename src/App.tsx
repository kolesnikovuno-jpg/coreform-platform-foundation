import React from "react";
import "./styles.css";

const sidebarItems = [
  "Dashboard",
  "Projects",
  "Engines",
  "Control Center",
  "Backoffice",
];

const Sidebar: React.FC = () => {
  return (
    <aside className="sidebar" aria-label="Sidebar">
      <div className="wordmark">COREFORM</div>
      <nav className="nav">
        {sidebarItems.map((item) => (
          <a key={item} className="nav-item" href="#">
            <span className="nav-dot" />
            <span>{item}</span>
          </a>
        ))}
      </nav>
      <div className="sidebar-footer">
        <small>© Coreform</small>
      </div>
    </aside>
  );
};

const UserCard: React.FC = () => {
  const email = "you@company.com";
  const role = "Administrator";
  const plan = "Foundation";

  return (
    <div className="user-card">
      <div>
        <div className="user-email">{email}</div>
        <div className="user-meta">{role} • {plan}</div>
      </div>
      <div className="avatar" aria-hidden>
        {email.charAt(0).toUpperCase()}
      </div>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <div className="app">
      <Sidebar />
      <main className="main">
        <header className="header">
          <div>
            <h1 className="title">FOUNDATION</h1>
            <p className="subtitle">Welcome back</p>
          </div>
          <div className="header-right">
            <UserCard />
            <button className="btn-primary">Create Project</button>
          </div>
        </header>

        <section className="content">
          <div className="empty-state">
            <div className="empty-graphic" aria-hidden>📦</div>
            <h2 className="empty-title">No projects yet</h2>
            <p className="empty-text">
              Projects you create will appear here. Start by creating your first project.
            </p>
            <button className="btn-primary">Create Project</button>
          </div>
        </section>
      </main>
    </div>
  );
};

export default App;
