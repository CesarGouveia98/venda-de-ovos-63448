import React, { useState, useEffect } from "react";
import { db, auth } from "./firebase";
import {
  doc,
  onSnapshot,
  updateDoc,
  addDoc,
  collection,
  deleteDoc,
} from "firebase/firestore";
import {
  onAuthStateChanged,
  signOut,
  updateProfile,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
} from "firebase/auth";

const EMAIL_VENDEDOR = "cesar_gouveia_98@hotmail.com";

// --- COMPONENTE DO SIMULADOR (CALCULADORA) ---
function SimuladorPrecos() {
  const [simTotal, setSimTotal] = useState(0);
  const [aberto, setAberto] = useState(false);
  const calc = (preco) => setSimTotal((prev) => prev + preco);

  return (
    <div className="mt-4 border-t border-stone-100 pt-4">
      <button
        onClick={() => setAberto(!aberto)}
        className="w-full py-3 bg-stone-100 rounded-2xl text-[10px] font-black uppercase tracking-widest text-stone-600"
      >
        {aberto ? "Fechar Calculadora" : "🧮 Calculadora de Preços"}
      </button>
      {aberto && (
        <div className="mt-4 p-4 bg-orange-50 rounded-[2rem] border border-orange-100 animate-in fade-in zoom-in duration-300">
          <div className="flex justify-between items-center mb-4">
            <span className="text-[10px] font-black uppercase text-orange-800">
              Simulação:
            </span>
            <span className="text-xl font-black text-orange-600">
              {simTotal.toFixed(2)}€
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => calc(0.3)}
              className="bg-white p-2 rounded-xl text-[9px] font-bold border border-orange-200"
            >
              +1 Ovo
            </button>
            <button
              onClick={() => calc(3.5)}
              className="bg-white p-2 rounded-xl text-[9px] font-bold border border-orange-200"
            >
              +Caixa 12
            </button>
            <button
              onClick={() => calc(4.5)}
              className="bg-white p-2 rounded-xl text-[9px] font-bold border border-orange-200"
            >
              +Caixa 15
            </button>
            <button
              onClick={() => calc(9.0)}
              className="bg-white p-2 rounded-xl text-[9px] font-bold border border-orange-200"
            >
              +Caixa 30
            </button>
          </div>
          <button
            onClick={() => setSimTotal(0)}
            className="w-full mt-2 text-[8px] font-black text-orange-400 uppercase"
          >
            Limpar
          </button>
        </div>
      )}
    </div>
  );
}

function InstallBanner() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstalled, setIsInstalled] = useState(false);
  useEffect(() => {
    if (
      window.matchMedia("(display-mode: standalone)").matches ||
      window.navigator.standalone
    )
      setIsInstalled(true);
    window.addEventListener("beforeinstallprompt", (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    });
  }, []);
  if (isInstalled || !deferredPrompt) return null;
  return (
    <div className="bg-orange-600 p-4 text-center">
      <button
        onClick={async () => {
          if (deferredPrompt) {
            deferredPrompt.prompt();
            setDeferredPrompt(null);
          }
        }}
        className="text-white px-6 py-2 rounded-full font-black text-[10px] uppercase"
      >
        Instalar App Augovos
      </button>
    </div>
  );
}

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nomeRegisto, setNomeRegisto] = useState("");
  const [mode, setMode] = useState("login");
  const [showResetInput, setShowResetInput] = useState(false);
  const [resetMessage, setResetMessage] = useState("");

  const [dadosVenda, setDadosVenda] = useState({
    quantidade: 0,
    retiradosHoje: 0,
    mediaDiaria: 0,
    ativo: true,
    forcarOffline: false,
    lastReset: "",
  });
  const [reservas, setReservas] = useState([]);
  const [estatisticas, setEstatisticas] = useState({
    semana: 0,
    mes: 0,
    ano: 0,
  });
  const [ovosComprometidos, setOvosComprometidos] = useState(0);

  const [showModal, setShowModal] = useState(false);
  const [qtdOvosTotal, setQtdOvosTotal] = useState(0);
  const [precoAcumulado, setPrecoAcumulado] = useState(0);
  const [cliquesUnidade, setCliquesUnidade] = useState(0);
  const [embalagens, setEmbalagens] = useState({ c12: 0, c15: 0, c30: 0 });
  const [dataBusca, setDataBusca] = useState("");
  const [horaBusca, setHoraBusca] = useState("");
  const [obs, setObs] = useState("");
  const [isVendedor, setIsVendedor] = useState(false);

  const ovosNasCaixas =
    embalagens.c30 * 30 + embalagens.c15 * 15 + embalagens.c12 * 12;
  const saldoOvos = qtdOvosTotal - ovosNasCaixas;
  const isSelecaoValida = () =>
    qtdOvosTotal >= 1 && saldoOvos <= 0 && saldoOvos >= -15 && dataBusca !== "";

  const limparReserva = () => {
    setQtdOvosTotal(0);
    setPrecoAcumulado(0);
    setCliquesUnidade(0);
    setEmbalagens({ c12: 0, c15: 0, c30: 0 });
    setDataBusca("");
    setHoraBusca("");
    setObs("");
  };

  const atualizarDoc = async (campo, valor, direto = false) => {
    const docRef = doc(db, "venda", "stock_atual");
    if (direto) {
      await updateDoc(docRef, { [campo]: valor });
      return;
    }
    let novoValor = Math.max(0, (dadosVenda[campo] || 0) + valor);
    if (campo === "retiradosHoje") {
      await updateDoc(docRef, {
        retiradosHoje: novoValor,
        quantidade: Math.max(0, (dadosVenda.quantidade || 0) + valor),
      });
    } else {
      await updateDoc(docRef, { [campo]: novoValor });
    }
  };

  const handleResetPassword = async () => {
    if (!email) {
      setResetMessage("⚠️ Insira o email acima.");
      return;
    }
    try {
      await sendPasswordResetEmail(auth, email);
      setResetMessage("✅ Email enviado! Verifique a caixa de entrada.");
      setTimeout(() => {
        setShowResetInput(false);
        setResetMessage("");
      }, 5000);
    } catch (err) {
      setResetMessage("❌ Erro ao enviar. Verifique o email.");
    }
  };

  useEffect(() => {
    const unsubAuth = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
    return () => unsubAuth();
  }, []);

  useEffect(() => {
    if (!user) return;
    const unsubStock = onSnapshot(doc(db, "venda", "stock_atual"), (d) => {
      if (d.exists()) {
        const data = d.data();
        const hojeStr = new Date().toISOString().split("T")[0];
        if (data.lastReset !== hojeStr)
          updateDoc(doc(db, "venda", "stock_atual"), {
            retiradosHoje: 0,
            lastReset: hojeStr,
          });
        setDadosVenda(data);
      }
    });
    const unsubReservas = onSnapshot(collection(db, "reservas"), (snap) => {
      let totalComp = 0;
      const list = snap.docs.map((d) => {
        const data = d.data();
        totalComp += Number(data.quantidade);
        return { id: d.id, ...data };
      });
      setOvosComprometidos(totalComp);
      setReservas(list);
    });

    let unsubStats = () => {};
    if (user.email === EMAIL_VENDEDOR) {
      unsubStats = onSnapshot(
        collection(db, "historico_vendas"),
        (snap) => {
          const agora = new Date();
          const inicioSemana = new Date(agora);
          inicioSemana.setDate(
            agora.getDate() - (agora.getDay() === 0 ? 6 : agora.getDay() - 1)
          );
          inicioSemana.setHours(0, 0, 0, 0);
          const inicioMes = new Date(agora.getFullYear(), agora.getMonth(), 1);
          const inicioAno = new Date(agora.getFullYear(), 0, 1);

          let s = 0,
            m = 0,
            a = 0;
          snap.docs.forEach((doc) => {
            const v = doc.data();
            const dataVenda = v.timestamp?.toDate();
            if (dataVenda) {
              const valor = parseFloat(v.valorTotal) || 0;
              if (dataVenda >= inicioSemana) s += valor;
              if (dataVenda >= inicioMes) m += valor;
              if (dataVenda >= inicioAno) a += valor;
            }
          });
          setEstatisticas({ semana: s, mes: m, ano: a });
        }
      );
    }

    return () => {
      unsubStock();
      unsubReservas();
      unsubStats();
    };
  }, [user]);

  if (loading)
    return (
      <div className="h-screen flex items-center justify-center font-black text-orange-600 italic text-2xl animate-pulse">
        AUGovos...
      </div>
    );

  if (!user) {
    return (
      <div className="min-h-screen bg-[#FDFCF8] flex items-center justify-center p-6 text-slate-900">
        <div className="bg-white p-10 rounded-[3rem] shadow-2xl w-full max-sm:max-w-xs">
          <h1 className="text-4xl font-black text-orange-600 italic mb-8 text-center">
            Augovos 🥚
          </h1>
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              try {
                if (mode === "register") {
                  const res = await createUserWithEmailAndPassword(
                    auth,
                    email,
                    password
                  );
                  await updateProfile(res.user, { displayName: nomeRegisto });
                } else {
                  await signInWithEmailAndPassword(auth, email, password);
                }
              } catch (err) {
                alert(err.message);
              }
            }}
            className="space-y-4"
          >
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-4 rounded-2xl bg-stone-100 font-bold outline-none text-stone-800"
              required
            />
            {!showResetInput && (
              <>
                <input
                  type="password"
                  placeholder="Senha"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-4 rounded-2xl bg-stone-100 font-bold outline-none text-stone-800"
                  required
                />
                {mode === "login" && (
                  <button
                    type="button"
                    onClick={() => setShowResetInput(true)}
                    className="w-full text-[9px] font-black text-stone-400 uppercase tracking-tighter text-right pr-2 italic"
                  >
                    Esqueci-me da senha
                  </button>
                )}
                <button className="w-full bg-orange-600 text-white py-4 rounded-2xl font-black uppercase shadow-lg">
                  {mode === "register" ? "Criar Conta" : "Entrar"}
                </button>
              </>
            )}
            {showResetInput && (
              <div className="bg-orange-50 p-4 rounded-2xl border border-orange-100 space-y-3 animate-in fade-in zoom-in duration-300">
                <p className="text-[9px] font-black uppercase text-orange-800 text-center italic">
                  Recuperar Acesso
                </p>
                <button
                  type="button"
                  onClick={handleResetPassword}
                  className="w-full bg-orange-600 text-white py-3 rounded-xl font-black text-[10px] uppercase"
                >
                  Enviar Link de Recuperação
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowResetInput(false);
                    setResetMessage("");
                  }}
                  className="w-full text-[8px] font-black text-stone-400 uppercase"
                >
                  Voltar ao Login
                </button>
                {resetMessage && (
                  <p className="text-[8px] font-bold text-center text-orange-900">
                    {resetMessage}
                  </p>
                )}
              </div>
            )}
            <button
              type="button"
              onClick={() => {
                setMode(mode === "login" ? "register" : "login");
                setShowResetInput(false);
              }}
              className="w-full text-[10px] font-black text-stone-400 uppercase underline italic text-center"
            >
              {mode === "login" ? "Criar nova conta" : "Voltar ao Login"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  const meuNome = user.displayName || "Utilizador";

  return (
    <div className="min-h-screen bg-[#FDFCF8] text-slate-900 pb-24 flex flex-col items-center">
      <InstallBanner />
      <div className="w-full max-w-md px-4">
        <header className="pt-10 mb-6 flex justify-between items-center">
          <h1 className="text-3xl font-black text-orange-600 italic">
            Augovos 🥚
          </h1>
          <div className="flex flex-col items-end">
            <span className="text-[10px] font-black uppercase mb-1 text-stone-800">
              {meuNome}
            </span>
            <button
              onClick={() => signOut(auth)}
              className="text-[8px] font-black text-stone-400 uppercase underline"
            >
              Sair
            </button>
            {user.email === EMAIL_VENDEDOR && (
              <button
                onClick={() => setIsVendedor(!isVendedor)}
                className="mt-2 bg-stone-900 text-white px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest"
              >
                {isVendedor ? "Ver como Cliente" : "Modo Vendedor"}
              </button>
            )}
          </div>
        </header>

        <div className="grid grid-cols-3 gap-2 mb-8 animate-in fade-in duration-500">
          <div className="bg-white p-3 md:p-4 rounded-2xl border border-stone-100 text-center shadow-sm flex flex-col justify-center min-h-[85px]">
            <p className="text-[9px] font-black uppercase text-stone-400 mb-1">
              Status
            </p>
            <div className="flex items-center justify-center gap-1">
              <div
                className={`w-2 h-2 rounded-full ${dadosVenda.forcarOffline ? "bg-red-500" : "bg-green-500 animate-pulse"}`}
              ></div>
              <span className="text-[11px] font-black uppercase text-stone-700">
                {dadosVenda.forcarOffline ? "Terminada" : "Coletando"}
              </span>
            </div>
            {user.email === EMAIL_VENDEDOR && (
              <button
                onClick={() =>
                  atualizarDoc("forcarOffline", !dadosVenda.forcarOffline, true)
                }
                className="mt-1 text-[7px] font-black underline opacity-30 uppercase"
              >
                Alterar
              </button>
            )}
          </div>

          <div className="bg-white p-3 md:p-4 rounded-2xl border border-stone-100 text-center shadow-sm flex flex-col justify-center min-h-[85px]">
            <p className="text-[9px] font-black uppercase text-stone-400 mb-1">
              Média Diária
            </p>
            <div className="flex items-center justify-center gap-2">
              {isVendedor && (
                <button
                  onClick={() => atualizarDoc("mediaDiaria", -1)}
                  className="text-stone-300 font-bold text-lg"
                >
                  -
                </button>
              )}
              <span className="text-xl font-black text-stone-700 leading-none">
                {dadosVenda.mediaDiaria}
              </span>
              {isVendedor && (
                <button
                  onClick={() => atualizarDoc("mediaDiaria", 1)}
                  className="text-stone-300 font-bold text-lg"
                >
                  +
                </button>
              )}
            </div>
          </div>

          <div className="bg-white p-3 md:p-4 rounded-2xl border border-stone-100 text-center shadow-sm flex flex-col justify-center min-h-[85px]">
            <p className="text-[9px] font-black uppercase text-stone-400 mb-1">
              Colhidos Hoje
            </p>
            <div className="flex items-center justify-center gap-2">
              {isVendedor && (
                <button
                  onClick={() => atualizarDoc("retiradosHoje", -1)}
                  className="text-stone-300 font-bold text-lg"
                >
                  -
                </button>
              )}
              <span className="text-xl font-black text-orange-600 leading-none">
                {dadosVenda.retiradosHoje}
              </span>
              {isVendedor && (
                <button
                  onClick={() => atualizarDoc("retiradosHoje", 1)}
                  className="text-stone-300 font-bold text-lg"
                >
                  +
                </button>
              )}
            </div>
          </div>
        </div>

        {isVendedor ? (
          <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
            {/* MAPA SEMANAL COM CÁLCULO DE RESERVAS FUTURAS E DA SEMANA */}
            {(() => {
              const agora = new Date();
              const diaDaSemana = agora.getDay() === 0 ? 6 : agora.getDay() - 1;
              const inicioSemana = new Date(agora);
              inicioSemana.setDate(agora.getDate() - diaDaSemana);
              inicioSemana.setHours(0, 0, 0, 0);

              const diasSemana = ["2ª", "3ª", "4ª", "5ª", "6ª", "Sáb", "Dom"].map(
                (nome, index) => {
                  const d = new Date(inicioSemana);
                  d.setDate(inicioSemana.getDate() + index);
                  const dataIso = d.toISOString().split("T")[0];
                  const reservasDoDia = reservas.filter(
                    (r) => r.dataBusca === dataIso
                  );
                  const totalOvosDia = reservasDoDia.reduce(
                    (acc, r) => acc + Number(r.quantidade),
                    0
                  );

                  return {
                    nome,
                    dataIso,
                    isHoje: dataIso === agora.toISOString().split("T")[0],
                    totalOvos: totalOvosDia,
                    qtdReservas: reservasDoDia.length,
                  };
                }
              );

              const hojeStr = agora.toISOString().split("T")[0];
              const futurasReservas = reservas.filter(
                (r) => r.dataBusca >= hojeStr
              );
              const totalOvosFuturos = futurasReservas.reduce(
                (acc, r) => acc + Number(r.quantidade),
                0
              );

              return (
                <div className="bg-white p-5 rounded-[2.5rem] border border-stone-100 mb-6 shadow-sm">
                  <div className="flex justify-between items-center mb-4 px-2">
                    <p className="text-[9px] font-black uppercase text-stone-400 tracking-[0.15em] italic">
                      📅 Reservas da Semana
                    </p>
                    <span className="text-[9px] font-black bg-orange-100 text-orange-700 px-3 py-1 rounded-full uppercase">
                      {totalOvosFuturos} ovos a entregar
                    </span>
                  </div>

                  <div className="grid grid-cols-7 gap-1 text-center">
                    {diasSemana.map((d) => (
                      <div
                        key={d.dataIso}
                        className="flex flex-col items-center gap-1"
                      >
                        <span
                          className={`text-[8px] font-bold ${d.isHoje ? "text-orange-600 font-black" : "text-stone-400"}`}
                        >
                          {d.nome}
                        </span>

                        <div
                          className={`w-full h-12 rounded-xl flex flex-col justify-center items-center border transition-all ${
                            d.isHoje
                              ? "bg-orange-500 text-white border-orange-500 shadow-md scale-105"
                              : d.totalOvos > 0
                              ? "bg-orange-50 text-orange-800 border-orange-200"
                              : "bg-stone-50 text-stone-300 border-stone-50"
                          }`}
                        >
                          {d.totalOvos > 0 ? (
                            <>
                              <span className="text-[11px] font-black leading-none">
                                x{d.totalOvos}
                              </span>
                              <span className="text-[6px] opacity-80 uppercase font-black mt-0.5">
                                {d.qtdReservas} res.
                              </span>
                            </>
                          ) : (
                            <span className="text-[8px] font-bold opacity-30">
                              -
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })()}

            {/* RESUMO FINANCEIRO */}
            <div className="bg-white p-5 rounded-[2.5rem] border border-stone-100 shadow-sm">
              <p className="text-center text-[8px] font-black uppercase text-stone-400 mb-4 tracking-[0.2em] italic">
                Resumo Financeiro (€)
              </p>
              <div className="grid grid-cols-3 gap-2">
                <div className="bg-stone-50 p-3 rounded-2xl text-center border border-stone-100 text-stone-800">
                  <p className="text-[7px] font-black text-stone-400 uppercase mb-1">
                    Semana
                  </p>
                  <p className="text-sm font-black">
                    {estatisticas.semana.toFixed(2)}€
                  </p>
                </div>
                <div className="bg-orange-50 p-3 rounded-2xl text-center border border-orange-100 text-orange-700">
                  <p className="text-[7px] font-black text-orange-400 uppercase mb-1">
                    Mês
                  </p>
                  <p className="text-sm font-black">
                    {estatisticas.mes.toFixed(2)}€
                  </p>
                </div>
                <div className="bg-stone-900 p-3 rounded-2xl text-center text-white">
                  <p className="text-[7px] font-black text-stone-400 uppercase mb-1">
                    Ano
                  </p>
                  <p className="text-sm font-black">
                    {estatisticas.ano.toFixed(2)}€
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-stone-900 text-white p-8 rounded-[3rem] shadow-xl relative overflow-hidden text-center">
              <p className="text-[10px] opacity-40 uppercase font-black mb-2">
                Stock Atual em Loja
              </p>
              <p className="text-7xl font-black">{dadosVenda.quantidade}</p>
              <p className="text-[10px] mt-4 font-black text-orange-400 uppercase tracking-widest italic">
                {ovosComprometidos} ovos reservados
              </p>
            </div>

            <div className="space-y-3 pt-4">
              <h3 className="font-black text-xs px-4 text-stone-400 uppercase italic">
                Gestão de Reservas
              </h3>
              {reservas
                .sort((a, b) => a.dataBusca.localeCompare(b.dataBusca))
                .map((res) => (
                  <div
                    key={res.id}
                    className="bg-white p-5 rounded-[2.5rem] border shadow-sm"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <p className="font-black text-stone-800 text-sm italic">
                          {res.cliente}
                        </p>
                        <p className="text-[10px] font-bold text-stone-500 uppercase">
                          {res.dataBusca} | {res.horaBusca}
                        </p>
                        {res.obs && (
                          <p className="text-[9px] text-orange-700 font-bold mt-1 bg-orange-50 p-2 rounded-lg italic">
                            💬 {res.obs}
                          </p>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="font-black text-orange-600 text-lg">
                          x{res.quantidade}
                        </p>
                        <p className="text-[10px] font-black text-green-600">
                          {res.valorTotal}€
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() =>
                          updateDoc(doc(db, "reservas", res.id), {
                            pago: !res.pago,
                          })
                        }
                        className={`flex-1 py-3 rounded-xl font-black text-[9px] border ${res.pago ? "bg-green-500 text-white border-green-500" : "bg-white text-stone-500 border-stone-200"}`}
                      >
                        {res.pago ? "PAGO ✅" : "PENDENTE ⏳"}
                      </button>
                      <button
                        onClick={async () => {
                          if (window.confirm("Concluir reserva?")) {
                            await addDoc(collection(db, "historico_vendas"), {
                              ...res,
                              timestamp: new Date(),
                            });
                            await deleteDoc(doc(db, "reservas", res.id));
                          }
                        }}
                        className="flex-1 bg-stone-900 text-white py-3 rounded-xl font-black text-[9px] uppercase"
                      >
                        CONCLUIR
                      </button>
                      <button
                        onClick={async () => {
                          if (window.confirm("Eliminar?")) {
                            await updateDoc(doc(db, "venda", "stock_atual"), {
                              quantidade:
                                dadosVenda.quantidade + res.quantidade,
                            });
                            await deleteDoc(doc(db, "reservas", res.id));
                          }
                        }}
                        className="px-4 bg-red-50 text-red-500 rounded-xl font-black text-[10px]"
                      >
                        X
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        ) : (
          /* MODO CLIENTE MANTIDO IGUAL */
          <div className="space-y-8 animate-in fade-in duration-700">
            <div className="bg-white rounded-[2.5rem] p-8 shadow-xl border border-stone-100">
              <h2 className="text-center font-black uppercase text-stone-400 text-[10px] mb-6 tracking-widest italic">
                Tabela de Preços 🥚
              </h2>
              <div className="space-y-4 text-stone-800">
                <div className="flex justify-between border-b border-stone-50 pb-2 text-sm">
                  <span>Ovo Unidade</span>
                  <span className="font-bold">0.30€</span>
                </div>
                <div className="flex justify-between border-b border-stone-50 pb-2 text-sm">
                  <span>Caixa 15 Ovos</span>
                  <span className="font-bold">4.50€</span>
                </div>
                <div className="flex justify-between border-b border-stone-50 pb-2 text-sm">
                  <span>Caixa 30 Ovos</span>
                  <span className="font-bold">9.00€</span>
                </div>
                <div className="flex justify-between bg-orange-50 p-4 rounded-2xl border border-orange-100 font-bold text-orange-700 items-center">
                  <span className="text-sm">Caixa 12 Ovos (Promoção)</span>
                  <div className="text-right">
                    <p className="text-sm">3.50€</p>
                  </div>
                </div>
              </div>
              <SimuladorPrecos />
            </div>

            <div className="p-10 rounded-[3rem] text-center shadow-2xl border-4 bg-white border-white relative">
              <p className="uppercase text-[10px] font-black opacity-40 mb-2 tracking-widest italic">
                Ovos Disponíveis
              </p>
              <div className="text-9xl font-black mb-8 text-orange-600 leading-none">
                {dadosVenda.quantidade}
              </div>
              <button
                onClick={() => {
                  limparReserva();
                  setShowModal(true);
                }}
                disabled={dadosVenda.quantidade <= 0}
                className={`w-full py-5 rounded-3xl font-black text-xs uppercase shadow-lg ${dadosVenda.quantidade > 0 ? "bg-orange-600 text-white" : "bg-stone-200 text-stone-400"}`}
              >
                {dadosVenda.quantidade > 0
                  ? dadosVenda.forcarOffline
                    ? "Fazer Reserva (Colheita Finalizada)"
                    : "Fazer Reserva"
                  : "Sem Stock"}
              </button>
            </div>

            <div className="mt-12 space-y-4">
              <h3 className="font-black text-xl px-4 text-stone-800 uppercase italic tracking-widest">
                Minhas Reservas
              </h3>
              {reservas
                .filter((r) => r.uid === user.uid)
                .map((res) => (
                  <div
                    key={res.id}
                    className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-stone-100 flex justify-between items-center text-stone-800"
                  >
                    <div>
                      <p className="font-black italic">{res.cliente}</p>
                      <p className="text-[10px] font-bold text-stone-500 uppercase">
                        {res.dataBusca} | {res.horaBusca}
                      </p>
                    </div>
                    <div className="flex flex-col items-end">
                      <div className="bg-orange-600 text-white px-4 py-2 rounded-xl font-black shadow-md">
                        x{res.quantidade}
                      </div>
                      {res.pago && (
                        <span className="text-[8px] font-black text-green-500 uppercase mt-1 italic">
                          Pago ✅
                        </span>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-stone-900/80 backdrop-blur-md flex items-end md:items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-[#FDFCF8] w-full max-w-md rounded-[3rem] p-8 shadow-2xl my-auto border-t-8 border-orange-600 animate-in slide-in-from-bottom duration-300">
            <h2 className="text-xl font-black mb-2 text-center italic uppercase text-stone-800">
              1. Seleção Tabelada
            </h2>
            <div className="bg-white p-6 rounded-[2.5rem] shadow-inner border border-stone-100 text-center mb-6">
              <div className="text-6xl font-black text-orange-600 mb-1">
                {qtdOvosTotal}
              </div>
              <div className="text-[12px] font-black text-stone-500 uppercase mb-4 tracking-tighter italic">
                Valor: {precoAcumulado.toFixed(2)}€
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    setQtdOvosTotal((prev) => prev + 1);
                    setPrecoAcumulado((prev) => prev + 0.3);
                    setCliquesUnidade((prev) => prev + 1);
                  }}
                  disabled={cliquesUnidade >= 11}
                  className={`py-3 rounded-xl font-black text-[10px] border ${cliquesUnidade >= 11 ? "opacity-20" : "bg-stone-50 text-stone-700"}`}
                >
                  +1 Ovo (0.30€)
                </button>
                <button
                  onClick={() => {
                    setQtdOvosTotal((prev) => prev + 12);
                    setPrecoAcumulado((prev) => prev + 3.5);
                  }}
                  className="bg-orange-50 py-3 rounded-xl font-black text-[10px] border border-orange-100 text-orange-700"
                >
                  +12 Ovos (3.50€)
                </button>
                <button
                  onClick={() => {
                    setQtdOvosTotal((prev) => prev + 15);
                    setPrecoAcumulado((prev) => prev + 4.5);
                  }}
                  className="bg-stone-50 py-3 rounded-xl font-black text-[10px] border text-stone-700"
                >
                  +15 Ovos (4.50€)
                </button>
                <button
                  onClick={() => {
                    setQtdOvosTotal((prev) => prev + 30);
                    setPrecoAcumulado((prev) => prev + 9.0);
                  }}
                  className="bg-stone-50 py-3 rounded-xl font-black text-[10px] border text-stone-700"
                >
                  +30 Ovos (9.00€)
                </button>
              </div>
              <button
                onClick={limparReserva}
                className="w-full mt-4 text-[8px] font-black text-red-400 uppercase tracking-widest"
              >
                Reiniciar Seleção
              </button>
            </div>

            <h2 className="text-xl font-black mb-2 text-center italic uppercase text-stone-800">
              2. Embalagem
            </h2>
            <div className="grid grid-cols-3 gap-2 mb-8">
              {[
                { k: "c30", l: "Cartão 30" },
                { k: "c15", l: "Caixa 15" },
                { k: "c12", l: "Caixa 12" },
              ].map((b) => (
                <div
                  key={b.k}
                  className="bg-white p-3 rounded-2xl border border-stone-100 flex flex-col items-center"
                >
                  <span className="text-[7px] font-black uppercase text-stone-800 mb-1">
                    {b.l}
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() =>
                        setEmbalagens({
                          ...embalagens,
                          [b.k]: Math.max(0, embalagens[b.k] - 1),
                        })
                      }
                      className="w-6 h-6 bg-stone-100 rounded-full font-black text-[10px] text-stone-800"
                    >
                      -
                    </button>
                    <span className="font-black text-xs text-stone-800">
                      {embalagens[b.k]}
                    </span>
                    <button
                      onClick={() =>
                        setEmbalagens({
                          ...embalagens,
                          [b.k]: embalagens[b.k] + 1,
                        })
                      }
                      className="w-6 h-6 bg-stone-100 rounded-full font-black text-[10px] text-stone-800"
                    >
                      +
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <h2 className="text-xl font-black mb-2 text-center italic uppercase text-stone-800">
              3. Data de Recolha
            </h2>
            <div className="space-y-2 mb-8">
              <div className="flex items-center gap-2 bg-white p-4 rounded-2xl border border-stone-50 shadow-sm">
                <span className="text-[10px] font-black uppercase text-stone-600 w-12 text-right italic">
                  📅 Data:
                </span>
                <input
                  type="date"
                  value={dataBusca}
                  onChange={(e) => setDataBusca(e.target.value)}
                  className="flex-1 bg-transparent text-[10px] font-bold outline-none text-stone-800"
                />
              </div>
              <div className="flex items-center gap-2 bg-white p-4 rounded-2xl border border-stone-50 shadow-sm">
                <span className="text-[10px] font-black uppercase text-stone-600 w-12 text-right italic">
                  ⏰ Hora:
                </span>
                <input
                  type="time"
                  value={horaBusca}
                  onChange={(e) => setHoraBusca(e.target.value)}
                  className="flex-1 bg-transparent text-[10px] font-bold outline-none text-stone-800"
                />
              </div>
              <div className="flex flex-col gap-1 bg-white p-4 rounded-2xl border border-stone-50 shadow-sm">
                <span className="text-[10px] font-black uppercase text-stone-600 italic px-1">
                  💬 Notas:
                </span>
                <textarea
                  value={obs}
                  onChange={(e) => setObs(e.target.value)}
                  placeholder="Ex: Deixar no portão..."
                  className="w-full bg-transparent text-[10px] font-bold outline-none h-12 resize-none text-stone-800 p-1 text-[10px]"
                />
              </div>
            </div>

            <button
              onClick={async () => {
                if (!isSelecaoValida()) return;
                await addDoc(collection(db, "reservas"), {
                  cliente: meuNome,
                  uid: user.uid,
                  quantidade: qtdOvosTotal,
                  detalheCaixas: embalagens,
                  dataBusca,
                  horaBusca: horaBusca || "A definir",
                  obs: obs,
                  valorTotal: precoAcumulado.toFixed(2),
                  pago: false,
                  timestamp: new Date(),
                });
                await updateDoc(doc(db, "venda", "stock_atual"), {
                  quantidade: dadosVenda.quantidade - qtdOvosTotal,
                });
                setShowModal(false);
              }}
              disabled={!isSelecaoValida()}
              className={`w-full py-5 rounded-3xl font-black uppercase shadow-xl text-xs ${isSelecaoValida() ? "bg-orange-600 text-white" : "bg-stone-200 text-stone-400"}`}
            >
              {isSelecaoValida()
                ? `Confirmar (${precoAcumulado.toFixed(2)}€)`
                : "Verifique Data e Quantidade"}
            </button>
            <button
              onClick={() => setShowModal(false)}
              className="w-full text-stone-400 font-bold text-[9px] uppercase py-4 text-center"
            >
              Voltar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;