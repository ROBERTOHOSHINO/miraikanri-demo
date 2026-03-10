import { useState } from "react";

const CLIENTS = [
  { id:1, kanji:"丸", color:"#c0392b", name:"丸山商事" },
  { id:2, kanji:"東", color:"#6c3483", name:"東京クリエイト" },
  { id:3, kanji:"翠", color:"#1e8449", name:"翠葉デザイン" },
  { id:4, kanji:"蒼", color:"#1a5276", name:"蒼天コンサルティング" },
];

const SUPPLIERS = [
  { id:1, kanji:"創", color:"#1a6fa8", name:"創文デザイン事務所" },
  { id:2, kanji:"映", color:"#117a65", name:"映像工房キネマ" },
  { id:3, kanji:"刷", color:"#5d6d7e", name:"刷新印刷株式会社" },
  { id:4, kanji:"師", color:"#7d6608", name:"師範学院" },
  { id:5, kanji:"技", color:"#4a235a", name:"技術スタッフ組合" },
  { id:6, kanji:"外", color:"#1b4f72", name:"外部ライター集団" },
];

const PRODUCTS = [
  { id:1, kanji:"企", color:"#e67e22", tag:"制作", name:"企画制作",     price:1500000, costPrice:1200000, supplierId:1 },
  { id:2, kanji:"撮", color:"#c0392b", tag:"制作", name:"撮影",         price:1200000, costPrice:800000,  supplierId:2 },
  { id:3, kanji:"編", color:"#8e44ad", tag:"制作", name:"映像編集",     price:2000000, costPrice:1900000,  supplierId:2 },
  { id:4, kanji:"印", color:"#16a085", tag:"印刷", name:"印刷物制作",   price:800000,  costPrice:55000,  supplierId:3 },
  { id:5, kanji:"研", color:"#d4ac0d", tag:"研修", name:"研修・セミナー",price:2500000, costPrice:2000000,  supplierId:4 },
  { id:6, kanji:"運", color:"#27ae60", tag:"運用", name:"運用管理",     price:1250000, costPrice:1300000,  supplierId:5 },
  { id:7, kanji:"稿", color:"#ca6f1e", tag:"制作", name:"原稿・コピー", price:900000,  costPrice:800000,  supplierId:6 },
  { id:8, kanji:"設", color:"#2471a3", tag:"設計", name:"システム設計", price:3500000, costPrice:2800000, supplierId:1 },
  { id:9, kanji:"策", color:"#a93226", tag:"企画", name:"戦略策定",     price:4000000, costPrice:3500000, supplierId:1 },
];

const TAGS = ["すべて", ...new Set(PRODUCTS.map(p => p.tag))];

type Client = typeof CLIENTS[number];
type Supplier = typeof SUPPLIERS[number];

type Row = {
  uid: number;
  prodId: number;
  kanji: string;
  color: string;
  name: string;
  price: number;
  costPrice: number;
  qty: number;
  supplier: Supplier;
};

const Badge = ({ kanji, color, size=40 }: { kanji: string; color: string; size?: number }) => (
  <div style={{
    width:size, height:size, borderRadius:7, background:color, color:"#fff",
    display:"flex", alignItems:"center", justifyContent:"center",
    fontSize:size*0.48, fontWeight:"bold", flexShrink:0,
    boxShadow:"0 2px 5px rgba(0,0,0,0.25)", letterSpacing:0
  }}>{kanji}</div>
);

const fmt = (n: number) => "¥" + Number(n).toLocaleString();

export default function App() {
  const [client, setClient] = useState<Client | null>(null);
  const [rows, setRows] = useState<Row[]>([]);
  const [tagFilter, setTagFilter] = useState("すべて");
  const [showCost, setShowCost] = useState(true);

  const visibleProducts = tagFilter === "すべて" ? PRODUCTS : PRODUCTS.filter(p => p.tag === tagFilter);

  const addRow = (prod: typeof PRODUCTS[number]) => {
    const existing = rows.find(r => r.prodId === prod.id);
    if (existing) {
      setRows(r => r.map(row => row.prodId === prod.id ? {...row, qty: row.qty+1} : row));
    } else {
      const sup = SUPPLIERS.find(s => s.id === prod.supplierId);
      if (!sup) return;
      setRows(r => [...r, { uid: Date.now(), prodId: prod.id, ...prod, qty:1, supplier: sup }]);
    }
  };

  const chgQty = (uid: number, d: number) => setRows(r => r.map(row => row.uid===uid ? {...row, qty:Math.max(1,row.qty+d)} : row));
  const del = (uid: number) => setRows(r => r.filter(row => row.uid!==uid));

  const totalSales = rows.reduce((s,r)=>s+r.price*r.qty,0);
  const totalCost  = rows.reduce((s,r)=>s+r.costPrice*r.qty,0);
  const profit = totalSales - totalCost;
  const margin = totalSales>0 ? Math.round(profit/totalSales*100) : 0;

  return (
    <div style={{fontFamily:"'Noto Sans JP',sans-serif", background:"#eef2f7", minHeight:"100vh", padding:"20px 16px"}}>
      <div style={{maxWidth:960, margin:"0 auto"}}>

        <div style={{background:"#0d1b4b", borderRadius:14, padding:"14px 24px", marginBottom:18, display:"flex", alignItems:"center", gap:14}}>
          <div style={{color:"#fff", fontSize:20, fontWeight:"bold", letterSpacing:2}}>未来かんり</div>
          <div style={{width:1, height:24, background:"#ffffff30"}}/>
          <div style={{color:"#90caf9", fontSize:13}}>見積＋原価 デモ</div>
          <label style={{marginLeft:"auto", color:"#fff", fontSize:13, cursor:"pointer", display:"flex", alignItems:"center", gap:6}}>
            <input type="checkbox" checked={showCost} onChange={e=>setShowCost(e.target.checked)}/>
            原価・粗利を表示
          </label>
        </div>

        <div style={{background:"#fff", borderRadius:12, padding:"16px 20px", marginBottom:14, boxShadow:"0 2px 8px rgba(0,0,0,0.07)"}}>
          <div style={{fontSize:12, color:"#888", marginBottom:10, fontWeight:"bold", letterSpacing:1}}>① クライアント</div>
          <div style={{display:"flex", gap:10, flexWrap:"wrap"}}>
            {CLIENTS.map(c=>(
              <div key={c.id} onClick={()=>setClient(c)}
                style={{display:"flex", alignItems:"center", gap:8, padding:"7px 14px", borderRadius:10, cursor:"pointer",
                  border:"2px solid", borderColor:client?.id===c.id ? c.color:"#e0e0e0",
                  background:client?.id===c.id ? c.color+"18":"#fafafa", transition:"all 0.18s"}}>
                <Badge kanji={c.kanji} color={c.color} size={34}/>
                <span style={{fontSize:13, fontWeight:"bold", color:"#333"}}>{c.name}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{background:"#fff", borderRadius:12, padding:"16px 20px", marginBottom:14, boxShadow:"0 2px 8px rgba(0,0,0,0.07)"}}>
          <div style={{fontSize:12, color:"#888", marginBottom:10, fontWeight:"bold", letterSpacing:1}}>② 製品・サービスを選ぶ（ボタンで追加）</div>
          <div style={{display:"flex", gap:6, marginBottom:12, flexWrap:"wrap"}}>
            {TAGS.map(t=>(
              <button key={t} onClick={()=>setTagFilter(t)}
                style={{padding:"4px 12px", borderRadius:20, border:"1.5px solid",
                  borderColor:tagFilter===t?"#0d1b4b":"#ddd",
                  background:tagFilter===t?"#0d1b4b":"#fff",
                  color:tagFilter===t?"#fff":"#555",
                  fontSize:12, cursor:"pointer", fontFamily:"inherit", transition:"all 0.15s"}}>
                {t}
              </button>
            ))}
          </div>
          <div style={{display:"flex", gap:8, flexWrap:"wrap"}}>
            {visibleProducts.map(p=>{
              const sup = SUPPLIERS.find(s=>s.id===p.supplierId);
              const inCart = rows.find(r=>r.prodId===p.id);
              return (
                <button key={p.id} onClick={()=>addRow(p)}
                  style={{display:"flex", alignItems:"center", gap:8, padding:"8px 12px",
                    borderRadius:10, border:`2px solid ${p.color}`,
                    background: inCart ? p.color+"22":"#fff",
                    cursor:"pointer", fontFamily:"inherit", position:"relative",
                    transition:"all 0.15s", minWidth:130}}
                  onMouseEnter={e=>e.currentTarget.style.background=p.color+"22"}
                  onMouseLeave={e=>e.currentTarget.style.background=inCart?p.color+"22":"#fff"}>
                  <Badge kanji={p.kanji} color={p.color} size={32}/>
                  {sup && (
                    <div style={{position:"absolute", top:4, right:4}}>
                      <Badge kanji={sup.kanji} color={sup.color} size={18}/>
                    </div>
                  )}
                  <div style={{textAlign:"left"}}>
                    <div style={{fontSize:12, fontWeight:"bold", color:"#333"}}>{p.name}</div>
                    <div style={{fontSize:11, color:"#999"}}>{fmt(p.price)}</div>
                    {inCart && <div style={{fontSize:10, color:p.color, fontWeight:"bold"}}>×{inCart.qty} 追加済</div>}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {client && rows.length>0 && (
          <div style={{background:"#fff", borderRadius:12, padding:"16px 20px", boxShadow:"0 2px 8px rgba(0,0,0,0.07)"}}>
            <div style={{display:"flex", alignItems:"center", gap:10, marginBottom:16}}>
              <Badge kanji={client.kanji} color={client.color} size={44}/>
              <div>
                <div style={{fontSize:17, fontWeight:"bold", color:"#222"}}>{client.name}　御中</div>
                <div style={{fontSize:12, color:"#aaa"}}>御見積書</div>
              </div>
            </div>
            <div style={{
              display:"grid",
              gridTemplateColumns: showCost ? "36px 1.8fr 1fr 60px 1fr 8px 36px 1.4fr 1fr 60px 1fr" : "36px 1.8fr 1fr 60px 1fr 8px",
              gap:3, marginBottom:4
            }}>
              {["","製品・サービス","単価","数量","金額",""].map((h,i)=>(
                <div key={i} style={{fontSize:10, color:"#999", padding:"3px 6px", background:"#f5f5f5", borderRadius:4, textAlign:i>=2&&i<=4?"right":"left"}}>{h}</div>
              ))}
              {showCost && ["","仕入先","単価","数量","原価"].map((h,i)=>(
                <div key={"c"+i} style={{fontSize:10, color:"#c87941", padding:"3px 6px", background:"#fff7ee", borderRadius:4, textAlign:i>=2?"right":"left"}}>{h}</div>
              ))}
            </div>
            {rows.map(row=>(
              <div key={row.uid} style={{
                display:"grid",
                gridTemplateColumns: showCost ? "36px 1.8fr 1fr 60px 1fr 8px 36px 1.4fr 1fr 60px 1fr" : "36px 1.8fr 1fr 60px 1fr 8px",
                gap:3, marginBottom:4, alignItems:"center"
              }}>
                <Badge kanji={row.kanji} color={row.color} size={30}/>
                <div style={{fontSize:13, fontWeight:"bold", padding:"5px 8px", background:"#fafafa", borderRadius:6}}>{row.name}</div>
                <div style={{textAlign:"right", fontSize:13, padding:"5px 8px", background:"#fafafa", borderRadius:6}}>{fmt(row.price)}</div>
                <div style={{display:"flex", alignItems:"center", justifyContent:"center", gap:2, background:"#fafafa", borderRadius:6, padding:"3px 4px"}}>
                  <button onClick={()=>chgQty(row.uid,-1)} style={{width:18,height:18,border:"1px solid #ddd",borderRadius:3,cursor:"pointer",background:"#fff",fontSize:12,lineHeight:1,padding:0}}>−</button>
                  <span style={{fontSize:12, minWidth:16, textAlign:"center"}}>{row.qty}</span>
                  <button onClick={()=>chgQty(row.uid,+1)} style={{width:18,height:18,border:"1px solid #ddd",borderRadius:3,cursor:"pointer",background:"#fff",fontSize:12,lineHeight:1,padding:0}}>＋</button>
                </div>
                <div style={{textAlign:"right", fontSize:13, fontWeight:"bold", color:"#0d1b4b", padding:"5px 8px", background:"#e8eaf6", borderRadius:6}}>{fmt(row.price*row.qty)}</div>
                <button onClick={()=>del(row.uid)} style={{border:"none",background:"none",color:"#ccc",cursor:"pointer",fontSize:14,padding:0}}>✕</button>
                {showCost && <>
                  <Badge kanji={row.supplier.kanji} color={row.supplier.color} size={30}/>
                  <div style={{fontSize:12, color:"#666", padding:"5px 8px", background:"#fff7ee", borderRadius:6}}>{row.supplier.name}</div>
                  <div style={{textAlign:"right", fontSize:12, color:"#888", padding:"5px 8px", background:"#fff7ee", borderRadius:6}}>{fmt(row.costPrice)}</div>
                  <div style={{textAlign:"center", fontSize:12, padding:"5px 4px", background:"#fff7ee", borderRadius:6}}>{row.qty}</div>
                  <div style={{textAlign:"right", fontSize:13, fontWeight:"bold", color:"#c87941", padding:"5px 8px", background:"#fff7ee", borderRadius:6}}>{fmt(row.costPrice*row.qty)}</div>
                </>}
              </div>
            ))}
            <div style={{marginTop:14, borderTop:"2px solid #eee", paddingTop:12, display:"flex", justifyContent:"flex-end", gap:16, flexWrap:"wrap"}}>
              <div style={{textAlign:"right"}}>
                <div style={{fontSize:11,color:"#aaa"}}>売上合計</div>
                <div style={{fontSize:22,fontWeight:"bold",color:"#0d1b4b"}}>{fmt(totalSales)}</div>
              </div>
              {showCost && <>
                <div style={{textAlign:"right"}}>
                  <div style={{fontSize:11,color:"#aaa"}}>原価合計</div>
                  <div style={{fontSize:22,fontWeight:"bold",color:"#c87941"}}>{fmt(totalCost)}</div>
                </div>
                <div style={{textAlign:"right", background:profit>=0?"#e9f7ef":"#fdedec", padding:"8px 16px", borderRadius:10}}>
                  <div style={{fontSize:11,color:"#aaa"}}>粗利（利益率）</div>
                  <div style={{fontSize:22,fontWeight:"bold",color:profit>=0?"#1e8449":"#c0392b"}}>
                    {fmt(profit)} <span style={{fontSize:14}}>({margin}%)</span>
                  </div>
                </div>
              </>}
            </div>
          </div>
        )}

        {(!client || rows.length===0) && (
          <div style={{textAlign:"center", color:"#bbb", padding:32, fontSize:13}}>
            {!client ? "① クライアントを選んでください" : "② 製品・サービスをボタンで追加してください"}
          </div>
        )}
      </div>
    </div>
  );
}