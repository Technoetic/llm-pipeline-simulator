import '../css/style.css';
let _llmCalls = 0, _pipeStart = 0;
const ve =
    "https://skeleton-analysis-production-d1bb.up.railway.app/api/llm/chat/completions",
  xe = "google/gemini-2.5-flash-lite",
  se = "https://dxaehcocrbvhatyfmrvp.supabase.co",
  ce = "sb_publishable_5_U3dll4HB9fAXOxmgm83w_wnOiei-e",
  X = { apikey: ce, Authorization: "Bearer " + ce },
  de = `You are a SQL assistant for a sliding sports database at Pyeongchang.
TABLES:
- skeleton_records: id, date, session, gender(M/W), format, nat, start_no, name, run, status(OK/DNS/DNF), start_time, int1, int2, int3, int4, finish, speed, athlete_id, air_temp, humidity_pct, pressure_hpa, wind_speed_ms, dewpoint_c, temp_avg, seg1, seg2, seg3, seg4, seg5, is_normal
- athletes: id, athlete_id, name, nat, birth_year, gender, height_cm, weight_kg, name_kr
- track_metadata: curve_number, curve_type, radius_m, banking_deg, elevation_m, elevation_drop_m, distance_from_start_m, segment, difficulty, coaching_tip
Names: 여찬혁=YEO Chanhyuk, 김지수=KIM Jisoo, 정승기=JUNG Seunggi, 홍수정=HONG Sujung
RULES: 1) SELECT only 2) Always status='OK' 3) Return ONLY SQL 4) LIMIT 100 max`,
  Ne = `You are a sports data analysis planner for skeleton/luge/bobsled at Pyeongchang.
Given a question, create a dynamic analysis plan.

Available tables: skeleton_records, athletes, track_metadata (see schema above).

Reply in JSON:
{
  "intent": "greeting|record|compare|environment|coaching|ranking|trend|out_of_scope",
  "plan": "1-2 sentence analysis strategy in Korean",
  "queries": ["SELECT ...", "SELECT ..."],
  "js_analysis": "description of client-side computation after DB results",
  "insight_type": "comparison|trend|correlation|ranking|distribution|summary|coaching|greeting"
}

RULES:
- Only SELECT queries, always filter status='OK'
- Max 3 queries
- For Korean names, use ILIKE: WHERE name ILIKE 'YEO%'
- For greetings (안녕, 하이, hello), set intent=greeting with empty queries
- For out of scope, set intent=out_of_scope with empty queries
- For coaching/advice questions, set intent=coaching
- Be creative with analysis - combine data from multiple angles`,
  ke = ["analyze", "db", "answer", "output"],
  V = ["edge-0-1", "edge-1-2", "edge-2-3"];
function x(n, e) {
  const t = document.getElementById("node-" + n);
  t &&
    (t.classList.remove("active", "done", "skip", "fail"),
    e && t.classList.add(e));
}
function U(n, e) {
  const t = document.getElementById("node-" + n);
  t && (t.querySelector(".node-detail").textContent = e);
}
function Q(n, e) {
  const t = document.getElementById(V[n]);
  t && (t.classList.remove("active", "done", "skip"), e && t.classList.add(e));
}
const G = {};
function L(n, e, t) {
  const r = document.getElementById(n);
  r &&
    (r.classList.remove("running", "done", "fail", "has-content"),
    e && r.classList.add(e),
    t &&
      ((G[n] = t),
      r.classList.add("has-content"),
      (r.title = "클릭하여 상세 보기")));
}
function Oe() {
  (document.querySelectorAll(".ptask").forEach((n) => n.remove()),
    Object.keys(G).forEach((n) => delete G[n]));
}
let Ce = 0;
function P(n, e) {
  const t = document.getElementById(n);
  if (!t) return null;
  const r = "dyn-ptask-" + Ce++,
    s = document.createElement("div");
  return (
    (s.className = "ptask"),
    (s.id = r),
    (s.textContent = e),
    t.appendChild(s),
    r
  );
}
function Me() {
  (ke.forEach((n) => {
    (x(n, ""), U(n, ""));
  }),
    V.forEach((n, e) => Q(e, "")),
    (document.getElementById("log-output").innerHTML = ""),
    Oe());
}
function Z(n) {
  return String(n)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\n/g, "<br>");
}
function ge(n) {
  let e = String(n);
  const t = e.split(`
`);
  let r = !1,
    s = "";
  const u = [];
  for (const a of t) {
    const h = a.trim();
    if (h.startsWith("|") && h.endsWith("|")) {
      if (h.replace(/[|\-\s]/g, "") === "") continue;
      const m = h
        .split("|")
        .filter((b) => b.trim() !== "")
        .map((b) => b.trim());
      r
        ? (s += "<tr>" + m.map((b) => "<td>" + b + "</td>").join("") + "</tr>")
        : ((s =
            '<table class="md-table"><thead><tr>' +
            m.map((b) => "<th>" + b + "</th>").join("") +
            "</tr></thead><tbody>"),
          (r = !0));
    } else
      (r && ((s += "</tbody></table>"), u.push(s), (s = ""), (r = !1)),
        u.push(a));
  }
  return (
    r && ((s += "</tbody></table>"), u.push(s)),
    (e = u.join(`
`)),
    (e = e.replace(/\n/g, "<br>")),
    (e = e.replace(
      /###\s+(.+?)(<br>|$)/g,
      '<strong style="font-size:1.05em;color:#f1f5f9">$1</strong>$2',
    )),
    (e = e.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")),
    (e = e.replace(/\*([^*]+)\*/g, "<em>$1</em>")),
    (e = e.replace(
      /`([^`]+)`/g,
      '<code style="background:rgba(255,255,255,0.08);padding:1px 4px;border-radius:3px;font-size:0.85em">$1</code>',
    )),
    (e = e.replace(
      /(?:^|<br>)&gt;\s*(.+?)(?=<br>|$)/g,
      '<div style="border-left:3px solid #3b82f6;padding:6px 12px;margin:6px 0;background:rgba(59,130,246,0.08);border-radius:4px">$1</div>',
    )),
    (e = e.replace(/(?:^|<br>)[•·]\s+/g, "<br>• ")),
    e
  );
}
let J = 0;
function f(n, e, t) {
  const r = document.getElementById("log-output");
  if (!r) return;
  const s = ((Date.now() - J) / 1e3).toFixed(1),
    u = t ? t + "-msg" : "";
  ((r.innerHTML +=
    '<div class="log-line"><span style="color:#64748b">[' +
    s +
    's]</span> <span class="phase-' +
    n +
    '">[' +
    n.toUpperCase() +
    ']</span> <span class="' +
    u +
    '">' +
    e +
    "</span></div>"),
    (r.scrollTop = r.scrollHeight));
}
function Re(n) {
  const e = document.getElementById("chatbot-messages");
  if (!e) return;
  const t = document.createElement("div");
  ((t.className = "chatbot-msg user"),
    (t.innerHTML = '<div class="chatbot-bubble user">' + Z(n) + "</div>"),
    e.appendChild(t),
    (e.scrollTop = e.scrollHeight));
}
function ye(n, e) {
  const t = document.getElementById("chatbot-messages");
  if (!t) return;
  const _el = ((Date.now() - _pipeStart) / 1000).toFixed(1);
  const _dbEl = document.querySelector('#node-db .node-detail'); const _db = _dbEl ? _dbEl.textContent.replace(/[^0-9]/g,'') : '0';
  const _on = document.getElementById('node-output');
  if (_on) {
    let _m = _on.querySelector('.output-metrics');
    if (!_m) { _m = document.createElement('div'); _m.className = 'output-metrics'; _on.appendChild(_m); }
     _m.innerHTML = '<span>' + String.fromCodePoint(9201) + ' ' + _el + String.fromCodePoint(52488) + '</span>'
      + '<span>' + String.fromCodePoint(128202) + ' ' + _db + String.fromCodePoint(44148) + '</span>'
      + '<span>' + String.fromCodePoint(129302) + ' LLM ' + _llmCalls + String.fromCodePoint(54924) + '</span>' ; const _pk = _on.getAttribute('data-picked'); if (_pk) _m.innerHTML += '<span>' + String.fromCodePoint(9878) + ' ' + _pk + '</span>';
    const _nd = _on.querySelector('.node-detail');
    if (_nd) _nd.textContent = '';
  }
  document.querySelectorAll("#chatbot-loading").forEach((u) => u.remove());
  const r = document.createElement("div");
  ((r.className = "chatbot-msg bot"), (n = ge(n)));
  const s = e ? '<span class="source-tag">' + Z(e) + "</span>" : "";
  ((r.innerHTML = '<div class="chatbot-bubble bot">' + n + s + "</div>"),
    t.appendChild(r),
    (t.scrollTop = t.scrollHeight));
}
function Te() {
  const n = document.getElementById("chatbot-messages");
  if (!n) return;
  const e = document.createElement("div");
  ((e.className = "chatbot-msg bot"),
    (e.id = "chatbot-loading"),
    (e.innerHTML =
      '<div class="chatbot-bubble bot loading">⏳ 분석 중...</div>'),
    n.appendChild(e),
    (n.scrollTop = n.scrollHeight));
}
function z(n, e) {
  ye(n, e);
}
function ue(n) {
  return new Promise((e) => setTimeout(e, n));
}
async function j(n, e = 0, t = 3) { _llmCalls++;
  for (let r = 0; r <= t; r++)
    try {
      const s = await fetch(ve, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: xe,
          messages: n,
          max_tokens: 1024,
          temperature: e,
        }),
      });
      if ((s.status === 503 || s.status === 429) && r < t) {
        await ue(1500 * (r + 1));
        continue;
      }
      if (!s.ok) throw new Error("LLM " + s.status);
      return (await s.json()).choices[0].message.content.trim();
    } catch (s) {
      if (r >= t) throw s;
      await ue(1500 * (r + 1));
    }
}
async function W(n, e) {
  const t = await fetch(se + "/rest/v1/" + n + "?" + e, { headers: X });
  if (!t.ok) throw new Error("DB " + t.status);
  return t.json();
}
function Be(n) {
  const e = n.match(/[\uac00-\ud7a3]{2,5}/g) || [],
    t = [
      "와",
      "과",
      "이랑",
      "하고",
      "이",
      "가",
      "은",
      "는",
      "을",
      "를",
      "의",
      "도",
      "에서",
      "에게",
      "한테",
    ];
  return [
    ...new Set(
      e
        .map((r) => {
          for (const s of t)
            if (r.endsWith(s) && r.length > s.length + 1)
              return r.slice(0, -s.length);
          return r;
        })
        .filter((r) => r.length >= 2),
    ),
  ];
}
async function De(n) {
  try {
    const e =
        se +
        "/rest/v1/athletes?select=name,name_kr,athlete_id&name_kr=eq." +
        encodeURIComponent(n) +
        "&limit=1",
      r = await (await fetch(e, { headers: X })).json();
    if (r.length > 0)
      return { engName: r[0].name, krName: n, aid: r[0].athlete_id };
  } catch {}
  return null;
}
function me(n) {
  if (!n) return !1;
  const e = n.toUpperCase().trim();
  return !(
    !e.startsWith("SELECT") ||
    ["INSERT", "UPDATE", "DELETE", "DROP", "ALTER", "CREATE", "--", "/*"].some(
      (t) => e.includes(t),
    )
  );
}
function fe(n) {
  try {
    if (
      /\b(AVG|COUNT|SUM|MIN|MAX|GROUP\s+BY|HAVING|STRFTIME|EXTRACT|DISTINCT)\b/i.test(
        n,
      ) ||
      /\bOR\b/i.test(n) ||
      /\(SELECT/i.test(n)
    )
      return null;
    const e = n.match(/FROM\s+(\w+)/i);
    if (!e) return null;
    const t = e[1],
      r = n.match(/SELECT\s+([\s\S]+?)\s+FROM/i);
    let s = se + "/rest/v1/" + t + "?";
    r &&
      r[1].trim() !== "*" &&
      (s += "select=" + encodeURIComponent(r[1].trim()) + "&");
    const u = n.match(/WHERE\s+([\s\S]+?)(?:\s+ORDER|\s+LIMIT|\s+GROUP|\s*$)/i);
    u &&
      u[1].split(/\s+AND\s+/i).forEach((m) => {
        m = m.trim();
        const b = m.match(/(\w+)\s*=\s*'([^']+)'/);
        if (b) {
          s += b[1] + "=eq." + encodeURIComponent(b[2]) + "&";
          return;
        }
        const E = m.match(/(\w+)\s*=\s*(\d+\.?\d*)/);
        if (E) {
          s += E[1] + "=eq." + E[2] + "&";
          return;
        }
        const N = m.match(/(\w+)\s+ILIKE\s+'([^']+)'/i);
        if (N) {
          s +=
            N[1] +
            "=ilike." +
            encodeURIComponent(N[2].replace(/%/g, "*")) +
            "&";
          return;
        }
        const S = m.match(/(\w+)\s*>=\s*(\d+\.?\d*)/);
        if (S) {
          s += S[1] + "=gte." + S[2] + "&";
          return;
        }
        const w = m.match(/(\w+)\s*<=\s*(\d+\.?\d*)/);
        if (w) {
          s += w[1] + "=lte." + w[2] + "&";
          return;
        }
        const R = m.match(/(\w+)\s*>\s*(\d+\.?\d*)/);
        if (R) {
          s += R[1] + "=gt." + R[2] + "&";
          return;
        }
        const T = m.match(/(\w+)\s*<\s*(\d+\.?\d*)/);
        if (T) {
          s += T[1] + "=lt." + T[2] + "&";
          return;
        }
        const p = m.match(/(\w+)\s+BETWEEN\s+(\d+\.?\d*)\s+AND\s+(\d+\.?\d*)/i);
        if (p) {
          s += p[1] + "=gte." + p[2] + "&" + p[1] + "=lte." + p[3] + "&";
          return;
        }
        const B = m.match(/(\w+)\s+IS\s+NOT\s+NULL/i);
        if (B) {
          s += B[1] + "=not.is.null&";
          return;
        }
        const g = m.match(/(\w+)\s+IS\s+NULL/i);
        if (g) {
          s += g[1] + "=is.null&";
          return;
        }
        const D = m.match(/(\w+)\s+LIKE\s+'([^']+)'/i);
        if (D) {
          s +=
            D[1] + "=like." + encodeURIComponent(D[2].replace(/%/g, "*")) + "&";
          return;
        }
        const k = m.match(/(\w+)\s*!=\s*'([^']+)'/);
        if (k) {
          s += k[1] + "=neq." + encodeURIComponent(k[2]) + "&";
          return;
        }
        const A = m.match(/(\w+)\s+IN\s*\(([^)]+)\)/i);
        if (A) {
          s += A[1] + "=in.(" + A[2].replace(/'/g, "").trim() + ")&";
          return;
        }
      });
    const a = n.match(/ORDER\s+BY\s+(\w+)(?:\s+(ASC|DESC))?/i);
    a &&
      (s +=
        "order=" +
        a[1] +
        (a[2] && a[2].toUpperCase() === "DESC" ? ".desc" : "") +
        "&");
    const h = n.match(/LIMIT\s+(\d+)/i);
    return ((s += "limit=" + (h ? h[1] : "100")), s);
  } catch {
    return null;
  }
}
function pe(n, e) {
  let t = [...n];
  const r = e.match(/WHERE\s+([\s\S]+?)(?:\s+ORDER|\s+LIMIT|\s+GROUP|\s*$)/i);
  if (r) {
    let a = r[1];
    const h = a.match(/\(([^)]+\s+OR\s+[^)]+)\)/i);
    if (h) {
      const b = h[1].split(/\s+OR\s+/i).map((E) =>
        t.filter((N) => {
          const S = E.match(/(\w+)\s+ILIKE\s+'%?([^'%]+)%?'/i);
          if (S)
            return (
              N[S[1]] &&
              String(N[S[1]]).toLowerCase().includes(S[2].toLowerCase())
            );
          const w = E.match(/(\w+)\s*=\s*'([^']+)'/);
          return w ? String(N[w[1]]).toLowerCase() === w[2].toLowerCase() : !0;
        }),
      );
      ((t = [
        ...new Map(
          b.flat().map((E) => [E.id || JSON.stringify(E), E]),
        ).values(),
      ]),
        (a = a
          .replace(/\([^)]+\s+OR\s+[^)]+\)\s*AND\s*/i, "")
          .replace(/\s*AND\s*\([^)]+\s+OR\s+[^)]+\)/i, "")));
    }
    a.split(/\s+AND\s+/i).forEach((m) => {
      m = m.trim();
      const b = m.match(/(\w+)\s*=\s*'([^']+)'/);
      if (b) {
        t = t.filter(
          (g) => String(g[b[1]]).toLowerCase() === b[2].toLowerCase(),
        );
        return;
      }
      const E = m.match(/(\w+)\s+ILIKE\s+'%?([^'%]+)%?'/i);
      if (E) {
        const g = E[2].toLowerCase();
        t = t.filter(
          (D) => D[E[1]] && String(D[E[1]]).toLowerCase().includes(g),
        );
        return;
      }
      const N = m.match(/(\w+)\s*>\s*(\d+\.?\d*)/);
      if (N) {
        t = t.filter((g) => parseFloat(g[N[1]]) > parseFloat(N[2]));
        return;
      }
      const S = m.match(/(\w+)\s*<\s*(\d+\.?\d*)/);
      if (S) {
        t = t.filter((g) => parseFloat(g[S[1]]) < parseFloat(S[2]));
        return;
      }
      const w = m.match(/(\w+)\s*>=\s*(\d+\.?\d*)/);
      if (w) {
        t = t.filter((g) => parseFloat(g[w[1]]) >= parseFloat(w[2]));
        return;
      }
      const R = m.match(/(\w+)\s+BETWEEN\s+(\d+\.?\d*)\s+AND\s+(\d+\.?\d*)/i);
      if (R) {
        t = t.filter((g) => {
          const D = parseFloat(g[R[1]]);
          return D >= parseFloat(R[2]) && D <= parseFloat(R[3]);
        });
        return;
      }
      const T = m.match(/(\w+)\s+IS\s+NOT\s+NULL/i);
      if (T) {
        t = t.filter((g) => g[T[1]] != null);
        return;
      }
      const p = m.match(/date.*?'(\d{4}-\d{2})/);
      if (p) {
        t = t.filter((g) => g.date && g.date.startsWith(p[1]));
        return;
      }
      const B = m.match(/(\d{1,2})/);
      if (m.toLowerCase().includes("month") && B) {
        t = t.filter(
          (g) => g.date && g.date.substring(5, 7) === B[1].padStart(2, "0"),
        );
        return;
      }
    });
  }
  const s = e.match(/ORDER\s+BY\s+(\w+)(?:\s+(ASC|DESC))?/i);
  if (s) {
    const a = s[1],
      h = s[2] && s[2].toUpperCase() === "DESC";
    t.sort((m, b) => {
      const E = parseFloat(m[a]) || 0,
        N = parseFloat(b[a]) || 0;
      return h ? N - E : E - N;
    });
  }
  const u = e.match(/LIMIT\s+(\d+)/i);
  return (u && (t = t.slice(0, parseInt(u[1]))), t);
}
let ne = null;
async function he() {
  if (ne) return ne;
  let n = [],
    e = 0;
  for (;;) {
    const t = await W(
      "skeleton_records",
      "select=*&status=eq.OK&order=id&offset=" + e + "&limit=1000",
    );
    if (((n = n.concat(t)), t.length < 1e3)) break;
    e += 1e3;
  }
  return ((ne = n), n);
}
function Ae(n) {
  if (!n || n.length === 0) return {};
  const e = { count: n.length };
  return (
    ["finish", "start_time", "speed"].forEach((t) => {
      const r = n
        .map((s) => parseFloat(s[t]))
        .filter((s) => !isNaN(s) && s > 0);
      r.length > 0 &&
        ((e[t + "_avg"] = +(r.reduce((s, u) => s + u, 0) / r.length).toFixed(
          3,
        )),
        (e[t + "_min"] = +Math.min(...r).toFixed(3)),
        (e[t + "_max"] = +Math.max(...r).toFixed(3)));
    }),
    e
  );
}
function Fe(n, e, t) {
  const r = (n.match(/\d+\.\d+/g) || []).map(Number);
  if (r.length === 0) return { pass: !0, wrong: 0, total: 0 };
  const s = new Set();
  [...e, t].forEach((a) => {
    Object.values(a || {}).forEach((h) => {
      typeof h == "number" &&
        (s.add(+h.toFixed(3)), s.add(+h.toFixed(2)), s.add(+h.toFixed(1)));
    });
  });
  let u = 0;
  return (
    r.forEach((a) => {
      [+a.toFixed(3), +a.toFixed(2), +a.toFixed(1)].some((h) => s.has(h)) ||
        u++;
    }),
    { pass: u === 0, wrong: u, total: r.length }
  );
}
function Pe(n, e) {
  const t = document.getElementById("llm-preview");
  if (!t) return;
  document.getElementById("llm-preview-title").textContent = n;
  let r = "";
  (e.forEach((s) => {
    ((r += '<span class="preview-label">' + Z(s.label) + "</span>"),
      (r +=
        '<div class="preview-text">' +
        (s.text.includes("|") ? ge(s.text) : Z(s.text)) +
        "</div>"));
  }),
    (document.getElementById("llm-preview-body").innerHTML = r),
    (t.style.display = "flex"));
}
async function qe(n) {
  (Me(),
    (J = Date.now()),
    (_pipeStart = Date.now()), (_llmCalls = 0), x("analyze", "active"),
    f("analyze", '질문 분석: "' + n + '"', ""));
  const e = P("parallel-analyze", "🎯 Intent"),
    t = P("parallel-analyze", "📋 분석 계획"),
    r = P("parallel-analyze", "SQL t=0"),
    s = P("parallel-analyze", "SQL t=.3"),
    u = P("parallel-analyze", "SQL t=.6");
  ([e, t, r, s, u].forEach((l) => L(l, "running")),
    f("analyze", "LLM 5회 병렬 시작...", ""));
  let a = null,
    h,
    m,
    b;
  const E =
    de +
    `
Question: ` +
    n +
    `
Generate SELECT SQL:`;
  try {
    const [l, o, i, d] = await Promise.all([
      j(
        [
          {
            role: "system",
            content:
              Ne +
              `

Schema:
` +
              de,
          },
          { role: "user", content: n },
        ],
        0.3,
      ).then((c) => {
        try {
          const I = c.match(/\{[\s\S]*\}/);
          a = I ? JSON.parse(I[0]) : null;
        } catch {}
        const y = a ? a.intent : "unknown";
        L(e, "done", {
          title: "Intent 분류",
          entries: [{ label: "결과", text: y }],
        });
        const _ = document.getElementById(e);
        (_ && (_.textContent = "🎯 " + y),
          L(t, "done", {
            title: "동적 분석 계획",
            entries: [
              { label: "전략", text: a ? a.plan : "-" },
              { label: "분석 유형", text: a ? a.insight_type : "-" },
              { label: "JS 분석", text: a ? a.js_analysis : "-" },
            ],
          }));
        const v = document.getElementById(t);
        return (
          v && a && (v.textContent = "📋 " + (a.insight_type || "plan")),
          a &&
            (f("analyze", "→ Intent: " + a.intent, ""),
            f("analyze", "→ 📋 " + (a.plan || "").substring(0, 80), "pass"),
            a.queries &&
              a.queries.length > 0 &&
              ((a._dynPtasks = a.queries.map((I, q) => {
                const F = I.match(/FROM\s+(\w+)/i),
                  te = F ? F[1] : "query",
                  je = I.substring(0, 30)
                    .replace(/SELECT\s+/i, "")
                    .trim(),
                  le = P("parallel-analyze", "🔍 " + te);
                return (
                  L(le, "done", {
                    title: "동적 쿼리 " + (q + 1),
                    entries: [{ label: "SQL", text: I }],
                  }),
                  le
                );
              })),
              f(
                "analyze",
                "→ 🔍 동적 쿼리 " + a.queries.length + "개 생성",
                "",
              ))),
          c
        );
      }),
      j(
        [
          { role: "system", content: E },
          { role: "user", content: n },
        ],
        0,
      ).then(
        (c) => (
          L(r, "done", {
            title: "SQL ① (t=0)",
            entries: [{ label: "SQL", text: c }],
          }),
          f("analyze", "→ SQL① 완료", ""),
          c
        ),
      ),
      j(
        [
          { role: "system", content: E },
          { role: "user", content: n },
        ],
        0.3,
      ).then(
        (c) => (
          L(s, "done", {
            title: "SQL ② (t=.3)",
            entries: [{ label: "SQL", text: c }],
          }),
          f("analyze", "→ SQL② 완료", ""),
          c
        ),
      ),
      j(
        [
          { role: "system", content: E },
          { role: "user", content: n },
        ],
        0.6,
      ).then(
        (c) => (
          L(u, "done", {
            title: "SQL ③ (t=.6)",
            entries: [{ label: "SQL", text: c }],
          }),
          f("analyze", "→ SQL③ 완료", ""),
          c
        ),
      ),
    ]);
    ((h = o), (m = i), (b = d));
  } catch (l) {
    (f("analyze", "✗ LLM 실패: " + l.message, "fail"),
      [e, t, r, s, u].forEach((o) => L(o, "fail")),
      x("analyze", "fail"),
      z("LLM 호출에 실패했습니다. 다시 시도해주세요.", ""));
    return;
  }
  const N = a ? a.intent : "record";
  if (N === "greeting") {
    (x("analyze", "done"),
      U("analyze", "greeting"),
      V.forEach((o, i) => Q(i, "skip")),
      ["db", "answer"].forEach((o) => x(o, "skip")),
      x("output", "done"),
      U("output", "인사 · " + ((Date.now() - J) / 1e3).toFixed(1) + "초"),
      f(
        "output",
        "✓ 인사 응답 (" + ((Date.now() - J) / 1e3).toFixed(1) + "초)",
        "pass",
      ));
    const l = await j(
      [
        {
          role: "system",
          content:
            "당신은 평창 스켈레톤/루지/봅슬레이 경기 분석 AI입니다. 친근하게 인사하고 어떤 질문을 할 수 있는지 안내해주세요. 3-4문장.",
        },
        { role: "user", content: n },
      ],
      0.5,
    ).catch(
      () => "안녕하세요! 😊 경기 기록, 선수 비교, 환경 분석 등을 질문해주세요.",
    );
    z(l, "Intent: greeting → LLM 직접 응답");
    return;
  }
  if (N === "out_of_scope") {
    (x("analyze", "done"),
      U("analyze", "out_of_scope"),
      V.forEach((l, o) => Q(o, "skip")),
      ["db", "answer"].forEach((l) => x(l, "skip")),
      x("output", "done"),
      U("output", "차단 · out_of_scope"),
      f("output", "범위 밖 질문 차단", "pass"),
      z(
        "이 질문은 경기 기록 데이터로 답변할 수 없습니다. 🙅<br>기록, 선수, 환경 관련 질문을 해주세요!",
        "Intent: out_of_scope",
      ));
    return;
  }
  const S = [h, m, b]
    .map((l) => {
      let o = l;
      const i = o.match(/```sql?\s*([\s\S]*?)```/);
      return (
        i && (o = i[1].trim()),
        (o = o.replace(/^sql\s*/i, "").trim()),
        o.endsWith(";") && (o = o.slice(0, -1)),
        o
      );
    })
    .filter((l) => me(l));
  f(
    "analyze",
    "SQL 검증: " + S.length + "/3 통과",
    S.length > 0 ? "pass" : "fail",
  );
  let w = S[0] || "";
  if (S.length >= 2) {
    const l = S.map((d) => d.replace(/\s+/g, " ").toLowerCase()),
      o = {};
    l.forEach((d, c) => {
      ((o[d] = o[d] || { c: 0, i: c }), o[d].c++);
    });
    let i = Object.keys(o)[0];
    for (const d of Object.keys(o)) o[d].c > o[i].c && (i = d);
    ((w = S[o[i].i]),
      f("analyze", "SQL 합의: " + o[i].c + "/" + S.length, "pass"));
  }
  (w &&
    !w.toUpperCase().includes("STATUS") &&
    (w = w.replace(/WHERE\s+/i, "WHERE status = 'OK' AND ")),
    x("analyze", "done"),
    Q(0, "done"),
    x("db", "active"));
  const R = P("parallel-db", "📊 메인 SQL");
  L(R, "running");
  const T = [];
  a &&
    a.queries &&
    a.queries.length > 0 &&
    a.queries.forEach((l, o) => {
      const i = (l.match(/FROM\s+(\w+)/i) || [])[1] || "query",
        d = P("parallel-db", "🔍 " + i + " " + (o + 1));
      (L(d, "running"), T.push(d));
    });
  let p = [],
    B = [];
  const g = (async () => {
      if (!w) return [];
      const l = fe(w);
      if (l) {
        const _ = await fetch(l, { headers: X });
        if (_.ok) return (f("db", "REST 변환 성공", ""), _.json());
      }
      f("db", "REST 변환 불가 → JS 필터 엔진 실행", "skip");
      const o = await he();
      f("db", "전체 데이터 " + o.length + "건 로드 → JS에서 SQL 실행", "");
      const i = pe(o, w);
      if (i.length >= 5)
        return (f("db", "JS 필터 결과: " + i.length + "건", "pass"), i);
      (i.length > 0 &&
        f("db", "JS 필터 " + i.length + "건 (부족) → 스마트 폴백", "skip"),
        f("db", "스마트 폴백: 질문에서 이름/조건 추출", ""));
      const d = Be(n);
      if (d.length >= 1) {
        const v = (await Promise.all(d.slice(0, 3).map((I) => De(I)))).filter(
          (I) => I != null,
        );
        if (v.length > 0) {
          f(
            "db",
            "이름 감지: " + v.map((F) => F.krName + "→" + F.engName).join(", "),
            "",
          );
          const I = await Promise.all(
              v.map((F) =>
                W(
                  "skeleton_records",
                  "select=*&name=eq." +
                    encodeURIComponent(F.engName) +
                    "&status=eq.OK&order=finish&limit=1000",
                ),
              ),
            ),
            q = I.flat();
          return (
            f(
              "db",
              "선수별 조회: " +
                v
                  .map((F, te) => F.krName + " " + I[te].length + "건")
                  .join(", "),
              "pass",
            ),
            q
          );
        }
      }
      const c = n.match(/(\d{1,2})월/);
      if (c) {
        const _ = c[1].padStart(2, "0");
        return (
          await W(
            "skeleton_records",
            "select=*&status=eq.OK&finish=gte.45&finish=lte.65&order=finish&limit=500",
          )
        ).filter((I) => I.date && I.date.substring(5, 7) === _);
      }
      const y = w.match(/ILIKE\s+'([^']+)'/i);
      if (y) {
        const _ = y[1].replace(/%/g, "").trim();
        return await W(
          "skeleton_records",
          "select=*&name=ilike." +
            encodeURIComponent(_ + "*") +
            "&status=eq.OK&order=finish&limit=200",
        );
      }
      return await W(
        "skeleton_records",
        "select=*&status=eq.OK&finish=gte.45&finish=lte.65&order=finish&limit=1000",
      );
    })()
      .then((l) => {
        ((p = Array.isArray(l) ? l : []),
          L(R, "done", {
            title: "메인 쿼리 결과",
            entries: [
              { label: "SQL", text: w },
              { label: "건수", text: p.length + "건" },
            ],
          }));
        const o = document.getElementById(R);
        (o && (o.textContent = "📊 " + p.length + "건"),
          f("db", "→ 메인: " + p.length + "건", "pass"));
      })
      .catch((l) => {
        (L(R, "fail"), f("db", "→ 메인 실패: " + l.message, "fail"));
      }),
    D = (async () => {
      if (!a || !a.queries || a.queries.length === 0) return;
      f("db", "→ 동적 쿼리 " + a.queries.length + "개 실행...", "");
      const l = await he(),
        o = await Promise.all(
          a.queries.map(async (d) => {
            let c = d
              .replace(/```sql?/g, "")
              .replace(/```/g, "")
              .trim();
            if ((c.endsWith(";") && (c = c.slice(0, -1)), !me(c))) return [];
            const y = fe(c);
            if (y)
              try {
                const _ = await fetch(y, { headers: X });
                if (_.ok) {
                  const v = await _.json();
                  if (v.length > 0) return v;
                }
              } catch {}
            return pe(l, c);
          }),
        );
      B = o;
      const i = o.reduce((d, c) => d + c.length, 0);
      (o.forEach((d, c) => {
        if (T[c])
          if (d.length > 0) {
            L(T[c], "done", {
              title: "동적 쿼리 " + (c + 1),
              entries: [{ label: "건수", text: d.length + "건" }],
            });
            const y = document.getElementById(T[c]);
            y && (y.textContent = "🔍 " + d.length + "건");
          } else {
            const y = document.getElementById(T[c]);
            y && y.remove();
          }
      }),
        i > 0 &&
          f("db", "→ 동적: " + i + "건 (쿼리 " + o.length + "개)", "pass"));
    })();
  (await Promise.all([g, D]),
    p.length === 0 && B.length > 0 && (p = B.flat()),
    (p = p.filter((l) => {
      const o = parseFloat(l.finish);
      return !o || (o >= 45 && o <= 65);
    })),
    U("db", p.length + "건"),
    x("db", "done"),
    Q(1, "done"),
    p.length === 0 &&
      N !== "coaching" &&
      f("db", "데이터 0건 → 코칭 모드로 전환", "skip"));
  const k = Ae(p);
  let A = null;
  (p.length > 0 &&
    p[0].name &&
    (A = p.reduce(
      (l, o) => (!l || parseFloat(o.finish) < parseFloat(l.finish) ? o : l),
      null,
    )),
    x("answer", "active"));
  const $ = [0, 0.3, 0.6, 0.9],
    M = ["A 정확", "B 분석", "C 창의", "D 인사이트"],
    Y = $.map((l, o) => {
      const i = P("parallel-answer", "💬 " + M[o]);
      return (L(i, "running"), i);
    });
  f(
    "answer",
    "LLM " + $.length + "개 병렬 생성 (t=" + $.join("/") + ")...",
    "",
  );
  const be = JSON.stringify(p.slice(0, 5)),
    Ee = JSON.stringify(k),
    we =
      B.length > 0
        ? `
동적 분석: ` +
          B.map(
            (l, o) =>
              "쿼리" +
              (o + 1) +
              "=" +
              l.length +
              "건 " +
              JSON.stringify(l.slice(0, 2)),
          ).join("; ")
        : "",
    Le = a
      ? `
분석 계획: ` +
        a.plan +
        `
분석 유형: ` +
        a.insight_type +
        (a.js_analysis
          ? `
JS 분석: ` + a.js_analysis
          : "")
      : "";
  let ae = "";
  if (p.length > 0 && p[0].name) {
    const l = {};
    p.forEach((i) => {
      const d = i.name;
      (l[d] || (l[d] = []), l[d].push(parseFloat(i.finish)));
    });
    const o = Object.entries(l)
      .filter(([, i]) => i.length >= 3)
      .map(([i, d]) => ({
        name: i,
        count: d.length,
        best: Math.min(...d).toFixed(2),
        avg: (d.reduce((c, y) => c + y, 0) / d.length).toFixed(2),
      }))
      .sort((i, d) => parseFloat(i.best) - parseFloat(d.best));
    o.length >= 2 &&
      o.length <= 10 &&
      (ae =
        `

선수별 통계:
` +
        o.map(
          (i, d) =>
            d +
            1 +
            ". " +
            i.name +
            ": 최고 " +
            i.best +
            "초, 평균 " +
            i.avg +
            "초 (" +
            i.count +
            "건)",
        ).join(`
`));
  }
  const Se = `당신은 스켈레톤 코치 AI입니다. DB 데이터 기반으로 한국어로 답변하세요.

규칙:
1) DB에 있는 숫자만 사용 (새 숫자 금지)
2) "선수별 통계"가 제공되면 반드시 각 선수의 최고/평균 기록을 개별적으로 언급하고 비교하세요
3) 비교 질문이면 "누가 더 빠른지" 명확히 결론 내세요
4) 전체 통계보다 선수별 통계를 우선 사용하세요

마크다운 형식 (필수):
- 핵심 수치는 **볼드**: **50.71초**, **156건**
- 제목/소제목은 ### 사용
- 항목 나열은 불릿(•) 또는 번호(1.) 사용
- 비교는 표 형식:
  | 선수 | 최고 | 평균 | 건수 |
  |------|------|------|------|
- 결론은 > 인용문으로 강조
- 코치 톤, 이모지 1-2개 사용`,
    _e =
      "질문: " +
      n +
      Le +
      `
DB(` +
      p.length +
      "건): " +
      be +
      `
집계: ` +
      Ee +
      ae +
      we;
  let C = [];
  try {
    ((C = await Promise.all(
      $.map((l, o) =>
        j(
          [
            { role: "system", content: Se },
            { role: "user", content: _e },
          ],
          l,
        )
          .then(
            (i) => (
              L(Y[o], "done", {
                title: M[o] + " (t=" + l + ")",
                entries: [{ label: "LLM 응답", text: i }],
              }),
              (document.getElementById(Y[o]).textContent = "💬 " + M[o] + " ✓"),
              f("answer", "→ " + M[o] + " 완료 (" + i.length + "자)", ""),
              i
            ),
          )
          .catch(() => (L(Y[o], "fail"), null)),
      ),
    )),
      (C = C.filter((l) => l != null)));
  } catch {
    (f("answer", "✗ LLM 실패 → 템플릿", "fail"),
      Y.forEach((i) => L(i, "fail")));
    const o = A
      ? "최고: " +
        k.finish_min +
        "초 (" +
        A.name +
        ") | 평균: " +
        k.finish_avg +
        "초 (" +
        k.count +
        "건)"
      : "데이터 " + (k.count || 0) + "건";
    (x("answer", "done"),
      x("output", "done"),
      U("output", "템플릿 폴백"),
      z(o, "LLM 실패 → 템플릿"));
    return;
  }
  if (C.length === 0) {
    (x("answer", "done"), x("output", "done"), z("답변 생성 실패", ""));
    return;
  }
  const K = P("parallel-answer", "⚖️ 심판");
  (L(K, "running"),
    f("answer", "⚖️ LLM 심판: " + C.length + "개 답변 채점 중...", ""));
  let O = 0;
  try {
    const l =
        C.length +
        `개의 답변을 5가지 기준으로 각각 1~10점 채점하고, 가장 좋은 답변을 선택해.

채점 기준:
1) 질문 적합성: 질문에 정확히 답하는가
2) 숫자 정확도: DB 숫자를 정확히 인용하는가
3) 비교 명확성: 비교 질문이면 각 대상을 개별 비교하는가
4) 마크다운: 표/볼드/구조가 잘 되어있는가
5) 인사이트: 분석/해석/코칭이 있는가

질문: ` +
        n +
        `

` +
        C.map(
          (d, c) =>
            "--- 답변 " +
            c +
            " (" +
            M[c] +
            `) ---
` +
            d,
        ).join(`

`) +
        `

반드시 아래 JSON 형식으로만 답해:
{"scores":[[질문적합,숫자정확,비교명확,마크다운,인사이트],[...],[...],[...]],"best":번호,"reason":"선택 이유 1줄"}`,
      o = await j(
        [
          {
            role: "system",
            content: "답변 품질 심판. 반드시 JSON으로만 답해.",
          },
          { role: "user", content: l },
        ],
        0,
      );
    let i = null;
    try {
      const d = o.match(/\{[\s\S]*\}/);
      d && (i = JSON.parse(d[0]));
    } catch {}
    if (i && i.best != null) {
      ((O = i.best), (O < 0 || O >= C.length) && (O = 0));
      const d = [
        "질문 적합성",
        "숫자 정확도",
        "비교 명확성",
        "마크다운",
        "인사이트",
      ];
      let c =
        "| 기준 | " +
        C.map((_, v) => M[v]).join(" | ") +
        ` |
`;
      ((c +=
        "|------|" +
        C.map(() => "------").join("|") +
        `|
`),
        i.scores &&
          i.scores.length > 0 &&
          (d.forEach((_, v) => {
            ((c += "| " + _ + " | "),
              (c += C.map((I, q) => {
                const F =
                  i.scores[q] && i.scores[q][v] != null ? i.scores[q][v] : "-";
                return String(F);
              }).join(" | ")),
              (c += ` |
`));
          }),
          (c += "| **합계** | "),
          (c += C.map((_, v) =>
            i.scores[v]
              ? "**" + i.scores[v].reduce((I, q) => I + (q || 0), 0) + "**"
              : "-",
          ).join(" | ")),
          (c += ` |
`)));
      const y = i.reason || "";
      (f("answer", "✓ 심판: " + M[O] + " 선택" + (y ? " — " + y : ""), "pass"),
        L(K, "done", {
          title: "⚖️ 심판 채점 결과",
          entries: [
            { label: "선택", text: M[O] + " (답변 " + O + ")" },
            { label: "이유", text: y },
            { label: "기준별 점수", text: c },
            { label: "원문 JSON", text: o },
          ],
        }));
    } else {
      const d = o.match(/(\d)/);
      if (d) {
        const c = parseInt(d[1]);
        c >= 0 && c < C.length && (O = c);
      }
      (f("answer", "✓ 심판: " + M[O] + " 선택 (점수표 없음)", "pass"),
        L(K, "done", {
          title: "⚖️ 심판 결과",
          entries: [
            { label: "선택", text: M[O] },
            { label: "원문", text: o },
          ],
        }));
    }
    ((document.getElementById(K).textContent = "⚖️ → " + M[O]),
      f("answer", "⚖️ " + M[O] + " 채택", "pass"));
  } catch {
    L(K, "fail");
    const o = [k.finish_avg, k.finish_min, k.count].filter(Boolean).map(String);
    let i = 0;
    (C.forEach((d, c) => {
      const y = o.filter((_) => d.includes(_)).length;
      y > i && ((i = y), (O = c));
    }),
      f("answer", "심판 실패 → 숫자 매칭: " + M[O], "skip"));
  }
  const re = C[O],
    oe = Fe(re, p, k);
  let H;
  (oe.pass
    ? (f("answer", "✓ 숫자 검증 통과", "pass"), (H = re))
    : (f("answer", "숫자 " + oe.wrong + "개 불일치 → 안전 폴백", "skip"),
      (H =
        "조회 결과: " +
        k.count +
        `건
`),
      A &&
        (H +=
          "최고: " +
          k.finish_min +
          "초 (" +
          A.name +
          (A.date ? ", " + A.date : "") +
          `)
`),
      (H +=
        "평균: " +
        (k.finish_avg || "-") +
        `초
최저: ` +
        (k.finish_max || "-") +
        "초")),
    x("answer", "done"),
    Q(2, "done"),
    x("output", "done"));
  const ee = ((Date.now() - J) / 1e3).toFixed(1),
    ie = document.getElementById("node-output");
  (ie &&
    (ie.querySelector(".node-detail").innerHTML =
      "⚖️ " + M[O] + "<br>" + ee + "초 · " + p.length + "건"), ie.setAttribute("data-picked", M[O]),
    f("output", "✓ 최종 답변 (" + ee + "초)", "pass"));
  const Ie =
    (a ? a.insight_type + " | " : "") + "DB " + p.length + "건 · " + ee + "초";
  z(H, Ie);
}
document.addEventListener("DOMContentLoaded", () => {
  const n = document.getElementById("llm-preview-close");
  (n &&
    n.addEventListener("click", () => {
      document.getElementById("llm-preview").style.display = "none";
    }),
    document.addEventListener("click", (a) => {
      const h = a.target.closest(".ptask.has-content");
      if (h && G[h.id]) {
        const m = G[h.id];
        Pe(m.title || "", m.entries || []);
      }
    }));
  const e = document.getElementById("chatbot-input"),
    t = document.getElementById("chatbot-send");
  let r = !1;
  function s(a) {
    ((r = a),
      (t.disabled = a),
      (e.disabled = a),
      (t.textContent = a ? "⏳" : "→"),
      (e.placeholder = a ? "처리 중..." : "질문을 입력하세요..."),
      a || e.focus());
  }
  async function u() {
    const a = e.value.trim();
    if (!(!a || r)) {
      (s(!0), (e.value = ""), Re(a), Te());
      try {
        await qe(a);
      } catch (h) {
        ye("오류: " + h.message, "");
      }
      (document.querySelectorAll("#chatbot-loading").forEach((h) => h.remove()),
        s(!1));
    }
  }
  (t.addEventListener("click", u),
    e.addEventListener("keydown", (a) => {
      a.key === "Enter" && u();
    }),
    document.querySelectorAll(".preset").forEach((a) => {
      a.addEventListener("click", () => {
        ((e.value = a.dataset.q), u());
      });
    }));
});
