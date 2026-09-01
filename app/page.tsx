"use client";
import data from "../data/base.json";
import {useMemo,useState} from "react";

type Person=typeof data.people[number];
type Svc=typeof data.svcs[number];
type Evaluation=typeof data.evaluations[number];

const pct=(n:number,d:number)=>d?Math.round((n/d)*1000)/10:0;
const norm=(v:string)=>String(v||"").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"").trim();
const statusClass=(v:string)=>norm(v)==="sim"?"yes":norm(v)==="nao"||norm(v)==="não"?"no":"sp";

function Dashboard({setPage}:{setPage:(p:string)=>void}){
 const p=data.people; const evals=data.evaluations;
 const meli=p.filter(x=>x.profile==='Meli').length, ext=p.filter(x=>x.profile==='Ext').length;
 const v=p.map(x=>x.vec), g=p.map(x=>x.geotab), t=p.map(x=>x.ticketlog);
 const yes=(arr:string[])=>arr.filter(x=>norm(x)==='sim').length;
 return <>
  <div className="hero"><div><h2>Dashboard</h2><p>Base automática da Biblioteca Frota Fixa</p></div><div className="meta">Fonte: 3 bases operacionais • atualização manual por nova carga</div></div>
  <div className="cards">
   {[['Pessoas',p.length,'Base Controle de acessos'],['SVCs',new Set(p.map(x=>x.svc).filter(Boolean)).size,'SVCs com pessoas'],['Avaliações registradas',evals.length,'Forms de retenção'],['Pessoas Ext',ext,'Acompanhamento de e-mail Meli']].map(([l,n,s])=><div className="card kpi" key={String(l)}><div className="label">{l}</div><div className="num">{n}</div><small>{s}</small></div>)}
  </div>
  <div className="grid">
   <div className="card"><div className="titleline"><h3>Acessos x Pessoas</h3><span>{p.length} pessoas</span></div>
    {[['VEC',v],['GeoTab',g],['TicketLog',t]].map(([name,arr])=>{const a=arr as string[];const y=yes(a),sp=a.filter(x=>norm(x)==='s.p.'||!x).length,n=a.length-y-sp;return <div key={String(name)} className="metricRow"><b>{name}</b><span><span className="tag yes">SIM {y} ({pct(y,a.length)}%)</span> <span className="tag no">NÃO {n}</span> <span className="tag sp">S.P. {sp}</span></span></div>})}
    <div className="notice">S.P. significa <b>Sem Preenchimento</b>. O sistema não presume o status quando a base não informa o campo.</div>
   </div>
   <div className="card"><div className="titleline"><h3>Perfis</h3><span>{meli+ext} pessoas</span></div>
    <div className="metricRow"><b>Meli</b><span>{meli} ({pct(meli,p.length)}%)</span></div>
    <div className="metricRow"><b>Ext</b><span>{ext} ({pct(ext,p.length)}%)</span></div>
    <div className="notice">Para <b>Ext</b>, o sistema terá um indicador separado para acompanhar a necessidade do e-mail Meli oficial.</div>
   </div>
  </div>
  <div className="card wide" style={{marginTop:14}}><div className="titleline"><h3>Treinamentos x SVC x Pessoas</h3><span>{evals.length} avaliações de retenção registradas</span></div>
   <div className="moduleGrid">
    <button className="module" onClick={()=>setPage('Pessoas & SVC')}><b>♙</b><strong>Pessoas & SVC</strong><small>Cadastro, perfil, SVC, regional e supervisor.</small></button>
    <button className="module" onClick={()=>setPage('Acessos')}><b>◇</b><strong>Acessos</strong><small>VEC, GeoTab, TicketLog e S.P. por pessoa.</small></button>
    <button className="module" onClick={()=>setPage('Treinamentos')}><b>▣</b><strong>Treinamentos</strong><small>Quem possui avaliação de retenção registrada.</small></button>
    <button className="module" onClick={()=>setPage('Avaliações')}><b>✓</b><strong>Avaliações</strong><small>Registro bruto vindo do Forms.</small></button>
   </div>
  </div>
  <div className="footer"><span>Biblioteca Frota Fixa • Central de controle</span><span>Base atual: {p.length} pessoas • {data.svcs.length} linhas SVC • {evals.length} avaliações</span></div>
 </>
}

function People({profile,setProfile,search,setSearch}:{profile:string;setProfile:(v:string)=>void;search:string;setSearch:(v:string)=>void}){
 const rows=useMemo(()=>data.people.filter(x=>(!profile||x.profile===profile)&&(!search||[x.name,x.email,x.svc,x.cpf].join(' ').toLowerCase().includes(search.toLowerCase()))),[profile,search]);
 return <><div className="hero"><div><h2>Pessoas & SVC</h2><p>Base principal de pessoas cruzada com SVC, regional e supervisor</p></div></div>
 <div className="card"><div className="toolbar"><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Buscar nome, CPF, e-mail ou SVC..."/><select value={profile} onChange={e=>setProfile(e.target.value)}><option value="">Todos os perfis</option><option>Meli</option><option>Ext</option></select></div>
 <div className="tableWrap" style={{marginTop:14}}><table className="dataTable"><thead><tr><th>Nome</th><th>Perfil</th><th>SVC</th><th>Regional</th><th>Supervisor</th><th>E-mail</th><th>E-mail Meli oficial</th></tr></thead><tbody>{rows.map(x=><tr key={x.id}><td><b>{x.name||'S.P.'}</b></td><td>{x.profile}</td><td>{x.svc||'S.P.'}</td><td>{x.regional}</td><td>{x.supervisor}</td><td>{x.email||'S.P.'}</td><td><span className={'tag '+statusClass(x.emailMeliOfficial)}>{x.emailMeliOfficial}</span></td></tr>)}</tbody></table></div></div></>
}

function Access({search,setSearch}:{search:string;setSearch:(v:string)=>void}){
 const rows=data.people.filter(x=>!search||[x.name,x.email,x.svc].join(' ').toLowerCase().includes(search.toLowerCase()));
 return <><div className="hero"><div><h2>Acessos</h2><p>Controle de VEC, GeoTab e TicketLog por pessoa</p></div></div><div className="cards">{['vec','geotab','ticketlog'].map(k=>{const vals=data.people.map(p=>String(p[k as keyof Person]||'S.P.'));const y=vals.filter(v=>norm(v)==='sim').length;const sp=vals.filter(v=>norm(v)==='s.p.'||!v).length;return <div className="card kpi" key={k}><div className="label">{k.toUpperCase()}</div><div className="num">{y}</div><small>{pct(y,vals.length)}% SIM • {sp} S.P.</small></div>})}</div><div className="card" style={{marginTop:14}}><div className="toolbar"><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Buscar pessoa ou SVC..."/></div><div className="tableWrap" style={{marginTop:14}}><table className="dataTable"><thead><tr><th>Nome</th><th>Perfil</th><th>SVC</th><th>VEC</th><th>GeoTab</th><th>TicketLog</th></tr></thead><tbody>{rows.map(x=><tr key={x.id}><td><b>{x.name||'S.P.'}</b></td><td>{x.profile}</td><td>{x.svc||'S.P.'}</td><td><span className={'tag '+statusClass(x.vec)}>{x.vec}</span></td><td><span className={'tag '+statusClass(x.geotab)}>{x.geotab}</span></td><td><span className={'tag '+statusClass(x.ticketlog)}>{x.ticketlog}</span></td></tr>)}</tbody></table></div></div></>
}

function Trainings(){
 const bySvc=new Map();
 for(const p of data.people){const k=p.svc||'S.P.'; if(!bySvc.has(k))bySvc.set(k,{people:new Set(),evaluated:new Set()});bySvc.get(k)!.people.add(p.id)}
 for(const e of data.evaluations){if(!bySvc.has(e.svc))bySvc.set(e.svc,{people:new Set(),evaluated:new Set()});bySvc.get(e.svc)!.evaluated.add(e.email||norm(e.name))}
 const rows=[...bySvc.entries()].map(([svc,v])=>({svc,people:v.people.size,evaluated:v.evaluated.size,pending:Math.max(0,v.people.size-v.evaluated.size)})).sort((a,b)=>b.people-a.people));
 return <><div className="hero"><div><h2>Treinamentos</h2><p>Treinamento com evidência de avaliação de retenção registrada no Forms</p></div></div><div className="cards"><div className="card kpi"><div className="label">Pessoas</div><div className="num">{data.people.length}</div><small>Base Controle de acessos</small></div><div className="card kpi"><div className="label">Avaliações registradas</div><div className="num">{data.evaluations.length}</div><small>Forms de retenção</small></div><div className="card kpi"><div className="label">Pessoas com avaliação</div><div className="num">{new Set(data.evaluations.map(x=>(x.email||norm(x.name)))).size}</div><small>Registro identificado</small></div><div className="card kpi"><div className="label">SVCs com avaliação</div><div className="num">{new Set(data.evaluations.map(x=>x.svc).filter(Boolean)).size}</div><small>Com resposta registrada</small></div></div><div className="card" style={{marginTop:14}}><div className="titleline"><h3>Treinamentos x SVC x Pessoas</h3><span>O status abaixo é baseado na existência de resposta no Forms</span></div><div className="tableWrap"><table className="dataTable"><thead><tr><th>SVC</th><th>Pessoas</th><th>Avaliações registradas</th><th>Sem avaliação registrada</th></tr></thead><tbody>{rows.map(r=><tr key={r.svc}><td><b>{r.svc}</b></td><td>{r.people}</td><td><span className="tag yes">{r.evaluated}</span></td><td><span className="tag sp">{r.pending}</span></td></tr>)}</tbody></table></div><div className="notice">Importante: a base enviada comprova a realização da <b>avaliação de retenção</b>; ela não traz um campo independente de conclusão do treinamento. Por isso o sistema não transforma automaticamente “avaliação registrada” em “treinamento concluído”.</div></div></>
}

function Evaluations(){return <><div className="hero"><div><h2>Avaliações</h2><p>Registro bruto da base “Avaliação de Retenção - Manual do OPs Frota Fixa (respostas)”</p></div></div><div className="card"><div className="tableWrap"><table className="dataTable"><thead><tr><th>Data/hora</th><th>Nome</th><th>E-mail</th><th>SVC</th></tr></thead><tbody>{data.evaluations.map(x=><tr key={x.id}><td>{x.timestamp}</td><td>{x.name}</td><td>{x.email}</td><td>{x.svc}</td></tr>)}</tbody></table></div></div></>}

export default function Home(){
 const [page,setPage]=useState('Dashboard');const [profile,setProfile]=useState('');const [search,setSearch]=useState('');
 const pages:Record<string,React.ReactNode>={Dashboard:<Dashboard setPage={setPage}/>, 'Pessoas & SVC':<People profile={profile} setProfile={setProfile} search={search} setSearch={setSearch}/>,Acessos:<Access search={search} setSearch={setSearch}/>,Treinamentos:<Trainings/>,Avaliações:<Evaluations/>};
 return <div className="shell"><aside className="sidebar"><div className="brand"><div className="logo">FF</div><div><h1>Biblioteca<br/>Frota Fixa</h1><span>HUB DE CONTROLE</span></div></div><div className="section">Menu</div><nav className="nav">{Object.keys(pages).map(n=><button className={page===n?'active':''} key={n} onClick={()=>{setPage(n);setSearch('')}}><b>{n==='Dashboard'?'⌂':n==='Pessoas & SVC'?'♙':n==='Acessos'?'◇':n==='Treinamentos'?'▣':'✓'}</b><span>{n}</span></button>)}</nav><div className="section">Administração</div>{['Importações','Histórico','Relatórios','Configurações','Usuários'].map(n=><button className="adminLink" key={n} onClick={()=>alert('Módulo reservado para a próxima etapa.')}>□ <span>{n}</span></button>)}<div className="user"><strong>Biblioteca Frota Fixa</strong><span>Base operacional</span></div></aside><section className="content"><header className="topbar"><div className="crumb">{page}</div><div className="topActions">{page==='Pessoas & SVC'&&<select value={profile} onChange={e=>setProfile(e.target.value)}><option value="">Todos os perfis</option><option>Meli</option><option>Ext</option></select>}<div className="avatar">FF</div></div></header><main>{pages[page]}</main></section></div>
}
