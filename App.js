const { useState, useEffect } = React;

    function App() {
      const [lastPeriod, setLastPeriod] = useState("2026-06-09");
      const [cycleLength, setCycleLength] = useState(28);
      const [useAutoCycle, setUseAutoCycle] = useState(true);
      const [showSettings, setShowSettings] = useState(false);
      const [saveStatus, setSaveStatus] = useState(null);
      const [loaded, setLoaded] = useState(false);
      const [activeTab, setActiveTab] = useState("home");

      const [logs, setLogs] = useState({});
      
     const [selectedLogDate, setSelectedLogDate] = useState(
    toDateKey(new Date())
);

      useEffect(() => {
        try {
          const saved = localStorage.getItem(STORAGE_KEY);
          if (saved) {
            const data = JSON.parse(saved);
            if (data.lastPeriod) setLastPeriod(data.lastPeriod);
            if (data.cycleLength) setCycleLength(data.cycleLength);
            if (data.useAutoCycle != null) setUseAutoCycle(data.useAutoCycle);
            if (data.logs) setLogs(data.logs);
          }
        } catch(e) {}
        setLoaded(true);
      }, []);

      useEffect(() => {
        if (!loaded) return;
        setSaveStatus("saving");
        const t = setTimeout(() => {
          try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify({ lastPeriod, cycleLength, useAutoCycle, logs }));
            setSaveStatus("saved");
            setTimeout(() => setSaveStatus(null), 2000);
          } catch(e) { setSaveStatus("error"); }
        }, 600);
        return () => clearTimeout(t);
      }, [lastPeriod, cycleLength, useAutoCycle, logs, loaded]);

      // Real cycle data detected from logged periods
      const autoStats = getAutoCycleStats(logs);
      const hasAutoStart = useAutoCycle && !!autoStats.mostRecentStart;
      const hasAutoLength = useAutoCycle && autoStats.averageCycleLength != null;

      const effectiveLastPeriod = hasAutoStart ? autoStats.mostRecentStart : lastPeriod;
      const effectiveCycleLength = hasAutoLength ? autoStats.averageCycleLength : cycleLength;

      const day = getDayOfCycle(effectiveLastPeriod, effectiveCycleLength);
      const currentPhase = getPhase(day, effectiveCycleLength);
      const nextPeriod = new Date(effectiveLastPeriod);
      nextPeriod.setDate(nextPeriod.getDate() + effectiveCycleLength);
      const daysUntilNext = Math.ceil((nextPeriod - new Date()) / 86400000);

      if (!loaded) return <div style={{display:"flex",alignItems:"center",justifyContent:"center",minHeight:"100vh",color:"#999",fontSize:14}}>Loading…</div>;

      const tabs = [
        { key:"home", label:"🏠 Home" },
        { key:"today", label:"📝 Log Today" },
        { key:"calendar", label:"📅 Calendar" },
        { key:"history", label:"📋 History" },
      ];

      return (
        <div style={{maxWidth:480,margin:"0 auto",fontFamily:"'Inter',system-ui,sans-serif",background:"#fafafa",minHeight:"100vh"}}>

          {/* Header */}
          <div style={{padding:"24px 16px 0",display:"flex",alignItems:"flex-start",justifyContent:"space-between"}}>
            <div>
              <h1 style={{margin:0,fontSize:22,fontWeight:800,color:"#1a1a1a"}}>CycleTrack 🌸</h1>
              <p style={{margin:"4px 0 0",fontSize:14,color:"#888"}}>Optimize your training with your cycle</p>
            </div>
            <div style={{fontSize:12,marginTop:4,minWidth:60,textAlign:"right"}}>
              {saveStatus==="saving"&&<span style={{color:"#bbb"}}>Saving…</span>}
              {saveStatus==="saved"&&<span style={{color:"#4CAF50"}}>✓ Saved</span>}
              {saveStatus==="error"&&<span style={{color:"#f44336"}}>Save failed</span>}
            </div>
          </div>

          {/* Tabs */}
          <div style={{display:"flex",borderBottom:"1px solid #eee",margin:"16px 0 0",background:"#fff",position:"sticky",top:0,zIndex:10}}>
            {tabs.map(t=>(
              <button key={t.key} className={`tab-btn${activeTab===t.key?" active":""}`} onClick={()=>setActiveTab(t.key)}>{t.label}</button>
            ))}
          </div>

          <div style={{padding:"16px 16px 32px"}}>

            {/* HOME TAB */}
            {activeTab==="home" && <>
              <CycleWheel currentDay={day} cycleLength={effectiveCycleLength}/>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:20}}>
                <div style={{background:"#fff",borderRadius:12,padding:14,border:"1px solid #eee"}}>
                  <div style={{fontSize:12,color:"#999",marginBottom:4}}>Current phase</div>
                  <div style={{fontSize:16,fontWeight:700,color:PHASES[currentPhase].color}}>{PHASES[currentPhase].emoji} {PHASES[currentPhase].name}</div>
                </div>
                <div style={{background:"#fff",borderRadius:12,padding:14,border:"1px solid #eee"}}>
                  <div style={{fontSize:12,color:"#999",marginBottom:4}}>Next period</div>
                  <div style={{fontSize:16,fontWeight:700,color:"#1a1a1a"}}>{daysUntilNext<=0?"Any day now":`In ${daysUntilNext} days`}</div>
                </div>
              </div>
              <div style={{marginBottom:16}}>
                {["menstrual","follicular","ovulation","luteal"].map(p=>(
                  <PhaseCard key={p} phaseKey={p} active={currentPhase===p} day={day}/>
                ))}
              </div>
              <div style={{background:"#fff",borderRadius:14,border:"1px solid #eee",overflow:"hidden",marginBottom:16}}>
                <button onClick={()=>setShowSettings(!showSettings)} style={{width:"100%",padding:"14px 16px",background:"none",border:"none",display:"flex",justifyContent:"space-between",alignItems:"center",cursor:"pointer",fontSize:14,fontWeight:600,color:"#444"}}>
                  <span>⚙️ Adjust your cycle dates</span>
                  <span>{showSettings?"▲":"▼"}</span>
                </button>
                {showSettings&&(
                  <div style={{padding:"0 16px 16px",borderTop:"1px solid #f0f0f0"}}>

                    <div style={{marginTop:14,marginBottom:14,display:"flex",alignItems:"flex-start",justifyContent:"space-between",gap:12}}>
                      <div>
                        <div style={{fontSize:13,fontWeight:600,color:"#444"}}>Auto-calculate from your logs</div>
                        <div style={{fontSize:12,color:"#999",marginTop:2,lineHeight:1.4}}>Uses your logged period days instead of manual settings</div>
                      </div>
                      <button onClick={()=>setUseAutoCycle(!useAutoCycle)}
                        style={{flexShrink:0,width:44,height:26,borderRadius:20,border:"none",cursor:"pointer",position:"relative",
                          background:useAutoCycle?PHASES[currentPhase].color:"#e0e0e0",transition:"background 0.2s"}}>
                        <span style={{position:"absolute",top:3,left:useAutoCycle?21:3,width:20,height:20,borderRadius:"50%",background:"#fff",transition:"left 0.2s",boxShadow:"0 1px 3px rgba(0,0,0,0.3)"}}/>
                      </button>
                    </div>

                    {useAutoCycle && (
                      <div style={{background:PHASES[currentPhase].bg,borderRadius:10,padding:"10px 12px",marginBottom:14,fontSize:12,color:"#555",lineHeight:1.6}}>
                        {autoStats.mostRecentStart ? (
                          <>
                            <div>📅 Last period detected: <strong>{formatDate(autoStats.mostRecentStart)}</strong></div>
                            {autoStats.averageCycleLength != null ? (
                              <div>📊 Average cycle length: <strong>{autoStats.averageCycleLength} days</strong> (from your last {autoStats.cycleCount} cycle{autoStats.cycleCount===1?"":"s"})</div>
                            ) : (
                              <div>Log one more period to start calculating your average cycle length.</div>
                            )}
                          </>
                        ) : (
                          <div>No periods logged yet — log your flow on the Today tab to start auto-detecting your cycle. Using manual settings below until then.</div>
                        )}
                      </div>
                    )}

                    <div style={{marginBottom:12,opacity:useAutoCycle?0.5:1}}>
                      <label style={{fontSize:13,color:"#666",display:"block",marginBottom:6}}>First day of last period {useAutoCycle&&"(manual fallback)"}</label>
                      <input type="date" value={lastPeriod} disabled={useAutoCycle && !!autoStats.mostRecentStart} onChange={e=>setLastPeriod(e.target.value)}
                        style={{width:"100%",padding:"10px 12px",borderRadius:8,border:"1.5px solid #ddd",fontSize:15,background:"#fafafa",boxSizing:"border-box"}}/>
                    </div>
                    <div style={{opacity:useAutoCycle?0.5:1}}>
                      <label style={{fontSize:13,color:"#666",display:"block",marginBottom:6}}>Cycle length {useAutoCycle&&"(manual fallback)"}: <strong>{cycleLength} days</strong></label>
                      <input type="range" min={21} max={40} value={cycleLength} disabled={hasAutoLength} onChange={e=>setCycleLength(Number(e.target.value))}
                        style={{accentColor:PHASES[currentPhase].color}}/>
                      <div style={{display:"flex",justifyContent:"space-between",fontSize:11,color:"#bbb"}}><span>21 days</span><span>40 days</span></div>
                    </div>
                    <p style={{fontSize:12,color:"#aaa",marginTop:12,lineHeight:1.5}}>Changes save automatically to this device.</p>
                  </div>
                )}
              </div>
              <p style={{fontSize:11,color:"#bbb",textAlign:"center",lineHeight:1.6}}>General guide only, not medical advice. Everyone's cycle varies.</p>
            </>}

            {/* TODAY TAB */}
            {activeTab==="today" && <>
              <div style={{background:PHASES[currentPhase].bg,borderRadius:12,padding:"12px 16px",marginBottom:16,border:`1.5px solid ${PHASES[currentPhase].color}22`}}>
                <div style={{fontSize:13,color:PHASES[currentPhase].color,fontWeight:700}}>{PHASES[currentPhase].emoji} {PHASES[currentPhase].name} phase · Day {day}</div>
                <div style={{fontSize:12,color:"#666",marginTop:2}}>{new Date().toLocaleDateString("en-ZA",{weekday:"long",day:"numeric",month:"long"})}</div>
              </div>
             <TodayTab
                logs={logs}
                setLogs={setLogs}
                currentPhase={currentPhase}
                cycleLength={effectiveCycleLength}
                selectedLogDate={selectedLogDate}
                setSelectedLogDate={setSelectedLogDate}
              />
            </>}

           {/* CALENDAR TAB */}
{activeTab === "calendar" && (
  <CalendarTab
    logs={logs}
    selectedLogDate={selectedLogDate}
    setSelectedLogDate={setSelectedLogDate}
    setActiveTab={setActiveTab}
    lastPeriod={effectiveLastPeriod}
    cycleLength={effectiveCycleLength}
  />
)}

            
            {/* HISTORY TAB */}
            {activeTab==="history" && <>
              <div style={{fontSize:13,color:"#999",marginBottom:16}}>Your last 60 logged days</div>
              <HistoryTab logs={logs} lastPeriod={effectiveLastPeriod} cycleLength={effectiveCycleLength}/>
            </>}

          </div>
        </div>
      );
    }

    ReactDOM.render(<App/>, document.getElementById("root"));
