    function HistoryTab({ logs, lastPeriod, cycleLength }) {
      const entries = Object.entries(logs)
        .filter(([,v]) => v && (v.flow!=null||v.mood||v.symptoms?.length||v.energy!=null||v.notes))
        .sort(([a],[b]) => b.localeCompare(a))
        .slice(0, 60);

      if (entries.length === 0) {
        return (
          <div style={{textAlign:"center",padding:"60px 20px",color:"#bbb"}}>
            <div style={{fontSize:40,marginBottom:12}}>📋</div>
            <div style={{fontSize:15,fontWeight:600,marginBottom:8,color:"#999"}}>No history yet</div>
            <div style={{fontSize:13}}>Start logging on the Today tab and it'll show up here</div>
          </div>
        );
      }

      return (
        <div>
          {entries.map(([dateKey, log]) => {
            const start = new Date(lastPeriod);
            const entry = new Date(dateKey + "T00:00:00");
            start.setHours(0,0,0,0); entry.setHours(0,0,0,0);
            const diffDays = Math.floor((entry - start) / 86400000);
            const cycleDay = Math.max(1, (diffDays % cycleLength) + 1);
            const phase = getPhase(cycleDay, cycleLength);
            const phaseInfo = PHASES[phase];

            return (
              <div key={dateKey} style={{background:"#fff",borderRadius:14,border:"1px solid #eee",padding:16,marginBottom:12}}>
                <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:10}}>
                  <div>
                    <div style={{fontSize:14,fontWeight:700,color:"#222"}}>{formatDate(dateKey)}</div>
                    <div style={{fontSize:12,color:phaseInfo.color,fontWeight:600,marginTop:2}}>{phaseInfo.emoji} {phaseInfo.name} · Day {cycleDay}</div>
                  </div>
                  <div style={{display:"flex",gap:6,alignItems:"center"}}>
                    {log.mood && <span style={{fontSize:22}}>{log.mood}</span>}
                    {log.energy!=null && <span style={{fontSize:14}}>{ENERGY_LEVELS[log.energy]}</span>}
                  </div>
                </div>

                {log.flow != null && (
                  <div style={{fontSize:13,color:"#C2185B",marginBottom:6,fontWeight:600}}>
                    {FLOW_LEVELS[log.flow].emoji} {FLOW_LEVELS[log.flow].label} flow
                  </div>
                )}

                {log.symptoms?.length > 0 && (
                  <div style={{display:"flex",flexWrap:"wrap",gap:4,marginBottom:6}}>
                    {log.symptoms.map(s=>(
                      <span key={s} style={{fontSize:11,padding:"3px 8px",borderRadius:20,background:"#FCE4EC",color:"#C2185B",fontWeight:600}}>{s}</span>
                    ))}
                  </div>
                )}

                {log.notes && (
                  <div style={{fontSize:13,color:"#555",marginTop:6,lineHeight:1.5,fontStyle:"italic"}}>"{log.notes}"</div>
                )}
              </div>
            );
          })}
        </div>
      );
    }
