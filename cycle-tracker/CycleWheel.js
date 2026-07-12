    function CycleWheel({ currentDay, cycleLength }) {
      const cx=110,cy=110,r=80;
      const phaseColors=["#C2185B","#7B1FA2","#F57F17","#2E7D32"];
      const phaseLengths=[5,cycleLength*0.46-5,cycleLength*0.57-cycleLength*0.46,cycleLength-cycleLength*0.57];
      const segments=[]; let startAngle=-90;
      phaseLengths.forEach((len,i)=>{
        const sweep=(len/cycleLength)*360, endAngle=startAngle+sweep;
        const s=startAngle*Math.PI/180, e=endAngle*Math.PI/180;
        const x1=cx+r*Math.cos(s),y1=cy+r*Math.sin(s),x2=cx+r*Math.cos(e),y2=cy+r*Math.sin(e);
        segments.push({d:`M${cx},${cy} L${x1},${y1} A${r},${r},0,${sweep>180?1:0},1,${x2},${y2} Z`,color:phaseColors[i]});
        startAngle=endAngle;
      });
      const dotAngle=(((currentDay-1)/cycleLength)*360-90)*Math.PI/180;
      const dotX=cx+(r-14)*Math.cos(dotAngle),dotY=cy+(r-14)*Math.sin(dotAngle);
      return (
        <div style={{display:"flex",justifyContent:"center",margin:"0 0 20px"}}>
          <svg width={220} height={220}>
            {segments.map((seg,i)=><path key={i} d={seg.d} fill={seg.color} opacity={0.85}/>)}
            <circle cx={cx} cy={cy} r={46} fill="#fff"/>
            <text x={cx} y={cy-8} textAnchor="middle" fontSize={13} fill="#444" fontWeight={600}>Day</text>
            <text x={cx} y={cy+14} textAnchor="middle" fontSize={28} fill="#222" fontWeight={800}>{currentDay}</text>
            <text x={cx} y={cy+30} textAnchor="middle" fontSize={11} fill="#999">of {cycleLength}</text>
            <circle cx={dotX} cy={dotY} r={9} fill="#fff" stroke="#333" strokeWidth={2.5}/>
          </svg>
        </div>
      );
    }
