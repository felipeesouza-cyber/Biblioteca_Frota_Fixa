"use client";

import { useState } from "react";

const modules = [
  ["⌂", "Dashboard", "Visão executiva da Frota Fixa"],
  ["♙", "Pessoas & SVC", "Base de colaboradores e unidades"],
  ["▣", "Treinamentos", "Trilhas e capacitação"],
  ["✓", "Avaliações", "Histórico e resultados"],
  ["◇", "Acessos", "VEC, GeoTab e TicketLog"],
];

export default function Home() {
  const [page, setPage] = useState("Dashboard");
  const [profile, setProfile] = useState("Todos os perfis");

  return (
    <div className="shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="logo">FF</div>
          <div>
            <h1>Biblioteca<br />Frota Fixa</h1>
            <span>HUB DE INFORMAÇÕES</span>
          </div>
        </div>

        <div className="section">Menu</div>

        <nav>
          {modules.map(([icon, name]) => (
            <button
              key={name}
              className={page === name ? "active" : ""}
              onClick={() => setPage(name)}
            >
              <b>{icon}</b>
              <span>{name}</span>
            </button>
          ))}
        </nav>

        <div className="section">Administração</div>

        {[
          "Importações",
          "Histórico de Importações",
          "Relatórios",
          "Configurações",
          "Usuários",
        ].map((name) => (
          <button className="adminLink" key={name}>
            □ <span>{name}</span>
          </button>
        ))}
      </aside>

      <section className="content">
        <header className="topbar">
          <strong>{page}</strong>

          <select
            value={profile}
            onChange={(e) => setProfile(e.target.value)}
          >
            <option>Todos os perfis</option>
            <option>Meli</option>
            <option>Ext</option>
          </select>
        </header>

        <main>
          <div className="hero">
            <h2>{page}</h2>
            <p>Central de informações do Departamento Frota Fixa</p>
          </div>

          {page === "Dashboard" ? (
            <>
              <div className="cards">
                <div className="card">
                  <span>Pessoas</span>
                  <strong>79</strong>
                  <small>Base atual</small>
                </div>

                <div className="card">
                  <span>SVCs</span>
                  <strong>70</strong>
                  <small>Ativos na base</small>
                </div>

                <div className="card">
                  <span>Treinamentos</span>
                  <strong>01</strong>
                  <small>Disponível</small>
                </div>

                <div className="card">
                  <span>Acessos GeoTab</span>
                  <strong>47</strong>
                  <small>Ativos</small>
                </div>
              </div>

              <div className="panel">
                <h3>Módulos da Biblioteca</h3>

                <div className="moduleGrid">
                  {modules.map(([icon, name, description]) => (
                    <button
                      className="module"
                      key={name}
                      onClick={() => setPage(name)}
                    >
                      <b>{icon}</b>
                      <strong>{name}</strong>
                      <small>{description}</small>
                    </button>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div className="panel empty">
              <h3>{page}</h3>

              <p>
                Esta área está preparada para receber os dados e
                funcionalidades da Biblioteca Frota Fixa.
              </p>

              <strong>
                Perfil selecionado: {profile}
              </strong>
            </div>
          )}
        </main>
      </section>
    </div>
  );
}
