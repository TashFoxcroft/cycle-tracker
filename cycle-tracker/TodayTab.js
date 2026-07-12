function TodayTab({
  logs,
  setLogs,
  currentPhase,
  cycleLength,
  selectedLogDate,
  setSelectedLogDate
}) {

  const log = logs[selectedLogDate] || {};

  function update(field, value) {
    setLogs(prev => ({
      ...prev,
      [selectedLogDate]: {
        ...prev[selectedLogDate],
        [field]: value
      }
    }));
  }

  function toggleSymptom(s) {
    const current = log.symptoms || [];
    const next = current.includes(s)
      ? current.filter(x => x !== s)
      : [...current, s];

    update("symptoms", next);
  }

  function toggleFlow(level) {
    update("flow", log.flow === level ? null : level);
  }

  const phase = PHASES[currentPhase];

      return (
  <div>

    <div
      style={{
        background:"#fff",
        borderRadius:14,
        border:"1px solid #eee",
        padding:16,
        marginBottom:14
      }}
    >
      <div
        style={{
          fontSize:13,
          fontWeight:700,
          color:"#333",
          marginBottom:12
        }}
      >
        📅 Log Date
      </div>

      <input
        type="date"
        value={selectedLogDate}
        onChange={(e)=>setSelectedLogDate(e.target.value)}
        style={{
          width:"100%",
          padding:"10px 12px",
          borderRadius:10,
          border:"1px solid #ddd",
          fontSize:15,
          boxSizing:"border-box"
        }}
      />
    </div>

    {/* Flow / Period */}
    
          <div style={{background:"#fff",borderRadius:14,border:"1px solid #eee",padding:16,marginBottom:14}}>
            <div style={{fontSize:13,fontWeight:700,color:"#333",marginBottom:12}}>🩸 Period flow today</div>
            <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
              {FLOW_LEVELS.map((f,i)=>(
                <button key={i} className={`flow-btn${log.flow===i?"selected":""}`} onClick={()=>toggleFlow(i)}
                  style={{width:"auto",height:"auto",padding:"8px 12px",borderRadius:20,fontSize:12,fontWeight:600,
                    background:log.flow===i?"#FCE4EC":"#fff",borderColor:log.flow===i?"#C2185B":"#e0e0e0",color:log.flow===i?"#C2185B":"#666"}}>
                  {f.emoji} {f.label}
                </button>
              ))}
              <button onClick={()=>update("flow",null)}
                style={{padding:"8px 12px",borderRadius:20,fontSize:12,fontWeight:600,border:"2px solid #eee",background:"#fafafa",color:"#bbb",cursor:"pointer"}}>
                None
              </button>
            </div>
          </div>

          {/* Mood */}
          <div style={{background:"#fff",borderRadius:14,border:"1px solid #eee",padding:16,marginBottom:14}}>
            <div style={{fontSize:13,fontWeight:700,color:"#333",marginBottom:12}}>😊 Mood</div>
            <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
              {MOODS.map(m=>(
                <button key={m} onClick={()=>update("mood", log.mood===m?null:m)}
                  style={{width:42,height:42,borderRadius:50,border:`2px solid ${log.mood===m?"#7B1FA2":"#eee"}`,
                    background:log.mood===m?"#F3E5F5":"#fafafa",fontSize:20,cursor:"pointer",transition:"all 0.15s"}}>
                  {m}
                </button>
              ))}
            </div>
          </div>

          {/* Energy */}
          <div style={{background:"#fff",borderRadius:14,border:"1px solid #eee",padding:16,marginBottom:14}}>
            <div style={{fontSize:13,fontWeight:700,color:"#333",marginBottom:12}}>⚡️ Energy level</div>
            <div style={{display:"flex",gap:8}}>
              {ENERGY_LEVELS.map((e,i)=>(
                <button key={i} onClick={()=>update("energy", log.energy===i?null:i)}
                  style={{flex:1,padding:"10px 4px",borderRadius:10,border:`2px solid ${log.energy===i?"#F57F17":"#eee"}`,
                    background:log.energy===i?"#FFFDE7":"#fafafa",fontSize:14,cursor:"pointer",textAlign:"center"}}>
                  {e}
                </button>
              ))}
            </div>
          </div>

          {/* Symptoms */}
          <div style={{background:"#fff",borderRadius:14,border:"1px solid #eee",padding:16,marginBottom:14}}>
            <div style={{fontSize:13,fontWeight:700,color:"#333",marginBottom:12}}>🩺 Symptoms</div>
            <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
              {SYMPTOMS.map(s=>{
                const sel = (log.symptoms||[]).includes(s);
                return (
                  <button key={s} onClick={()=>toggleSymptom(s)}
                    style={{padding:"7px 13px",borderRadius:20,fontSize:12,fontWeight:600,cursor:"pointer",transition:"all 0.15s",
                      border:`2px solid ${sel?"#C2185B":"#e0e0e0"}`,background:sel?"#FCE4EC":"#fff",color:sel?"#C2185B":"#666"}}>
                    {s}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Notes */}
          <div style={{background:"#fff",borderRadius:14,border:"1px solid #eee",padding:16,marginBottom:14}}>
            <div style={{fontSize:13,fontWeight:700,color:"#333",marginBottom:10}}>📝 Notes</div>
            <textarea value={log.notes||""} onChange={e=>update("notes",e.target.value)}
              placeholder="How are you feeling today? Anything to note..."
              style={{width:"100%",minHeight:80,padding:"10px 12px",borderRadius:8,border:"1.5px solid #ddd",
                fontSize:14,fontFamily:"inherit",resize:"vertical",outline:"none",color:"#333",background:"#fafafa"}}/>
          </div>
        </div>
      );
    }
