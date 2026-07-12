    function PhaseCard({ phaseKey, active, day }) {
      const phase = PHASES[phaseKey];
      return (
        <div style={{background:active?phase.bg:"#fafafa",border:active?`2.5px solid ${phase.color}`:"2px solid #e8e8e8",borderRadius:16,padding:20,marginBottom:14,transition:"all 0.3s",opacity:active?1:0.6,boxShadow:active?`0 4px 20px ${phase.color}25`:"none"}}>
          <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:8}}>
            <span style={{fontSize:24}}>{phase.emoji}</span>
            <div>
              <div style={{display:"flex",alignItems:"center",gap:8,flexWrap:"wrap"}}>
                <h3 style={{margin:0,fontSize:17,fontWeight:700,color:phase.color}}>{phase.name}</h3>
                {active&&<span style={{background:phase.color,color:"#fff",fontSize:11,fontWeight:700,padding:"2px 8px",borderRadius:20}}>YOU ARE HERE · Day {day}</span>}
              </div>
              <div style={{fontSize:12,color:"#888",marginTop:2}}>{phase.days}</div>
            </div>
            <div style={{marginLeft:"auto",textAlign:"right"}}>
              <div style={{fontSize:11,color:"#999"}}>Energy</div>
              <div style={{fontSize:13,fontWeight:600,color:phase.color}}>{phase.energy}</div>
            </div>
          </div>
          {active&&<>
            <p style={{margin:"10px 0 12px",fontSize:14,color:"#444",lineHeight:1.5}}>{phase.description}</p>
            <div style={{marginBottom:10}}>
              <div style={{fontSize:12,fontWeight:700,color:"#555",marginBottom:6,textTransform:"uppercase",letterSpacing:0.5}}>Best workouts right now</div>
              <div style={{display:"flex",flexWrap:"wrap",gap:6}}>{phase.workouts.map(w=><span key={w} style={{background:phase.color,color:"#fff",borderRadius:20,padding:"4px 12px",fontSize:13,fontWeight:500}}>{w}</span>)}</div>
            </div>
            <div style={{background:"rgba(255,255,255,0.7)",borderRadius:10,padding:"10px 12px",fontSize:13,color:"#444",lineHeight:1.5,marginBottom:8}}>💡 {phase.tips}</div>
            <div style={{fontSize:12,color:"#999"}}>⚠️ Avoid: {phase.avoid}</div>
          </>}
        </div>
      );
    }
