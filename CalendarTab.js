function CalendarTab({
  logs,
  selectedLogDate,
  setSelectedLogDate,
  setActiveTab,
  lastPeriod,
  cycleLength
}) {

  const [displayDate, setDisplayDate] = React.useState(new Date());

  const year = displayDate.getFullYear();
  const month = displayDate.getMonth();

  const monthName = displayDate.toLocaleString("default", {
    month: "long"
  });

  const weekdays = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];

  const today = new Date();

  const { predictedDays, fertileDays, ovulationKey } = React.useMemo(
    () => getCycleCalendarData(lastPeriod, cycleLength, year, month),
    [lastPeriod, cycleLength, year, month]
  );

  const firstDay = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  let startDay = firstDay.getDay();
  startDay = startDay === 0 ? 6 : startDay - 1;

  const calendarDays = [];

  for (let i = 0; i < startDay; i++) {
    calendarDays.push(null);
  }

  for (let d = 1; d <= daysInMonth; d++) {
    calendarDays.push(d);
  }

  function openDay(day) {

    if (!day) return;

    const key =
      `${year}-${String(month+1).padStart(2,"0")}-${String(day).padStart(2,"0")}`;

    setSelectedLogDate(key);
    setActiveTab("today");
  }

  return (

    <div
      style={{
        background:"#fff",
        borderRadius:14,
        border:"1px solid #eee",
        padding:20
      }}
    >

      {/* Header */}

      <div
        style={{
          display:"flex",
          justifyContent:"space-between",
          alignItems:"center",
          marginBottom:20
        }}
      >

        <button
          onClick={() => setDisplayDate(new Date(year, month-1, 1))}
          style={{
            background:"none",
            border:"none",
            fontSize:22,
            cursor:"pointer"
          }}
        >
          ◀
        </button>

        <h2>
          🌸 {monthName} {year}
        </h2>

        <button
          onClick={() => setDisplayDate(new Date(year, month+1, 1))}
          style={{
            background:"none",
            border:"none",
            fontSize:22,
            cursor:"pointer"
          }}
        >
          ▶
        </button>

      </div>

      {/* Weekdays */}

      <div
        style={{
          display:"grid",
          gridTemplateColumns:"repeat(7,1fr)",
          gap:8,
          textAlign:"center",
          marginBottom:8
        }}
      >

        {weekdays.map(day=>

          <div
            key={day}
            style={{
              fontWeight:700,
              fontSize:13,
              color:"#777"
            }}
          >
            {day}
          </div>

        )}

      </div>

      {/* Calendar */}

      <div
        style={{
          display:"grid",
          gridTemplateColumns:"repeat(7,1fr)",
          gap:8
        }}
      >

        {calendarDays.map((day,index)=>{

          if(day===null){

            return <div key={index}></div>;

          }

          const key =
            `${year}-${String(month+1).padStart(2,"0")}-${String(day).padStart(2,"0")}`;

          const log = logs[key];

          const isToday =
            today.getFullYear()===year &&
            today.getMonth()===month &&
            today.getDate()===day;

          const isSelected =
            key===selectedLogDate;
        const isPredictedPeriod = predictedDays.includes(key);
        
        const isOvulation = key === ovulationKey;
        
        const isFertile = fertileDays.includes(key);

          return(

            <div
              key={index}
              onClick={()=>openDay(day)}
              style={{
                height:55,
                borderRadius:10,
                cursor:"pointer",
               background:
                isSelected
                  ? "#E1BEE7"
                  : isToday
                  ? "#F8BBD0"
                  : isOvulation
                  ? "#FFE082"
                  : isFertile
                  ? "#E8F5E9"
                  : isPredictedPeriod
                  ? "#FCE4EC"
                  : "#fafafa",
                border:
                  isToday
                    ? "2px solid #C2185B"
                    : "1px solid #eee",
                display:"flex",
                flexDirection:"column",
                justifyContent:"center",
                alignItems:"center",
                transition:"0.2s"
              }}
            >

              <div
                style={{
                  fontWeight:isToday ? 700 : 600,
                            fontSize:15,
                  color:isToday?"white":"#333"
                }}
              >
                {day}
              </div>

              {log && (

                <div
                  style={{
                    display:"flex",
                    gap:2,
                    marginTop:3,
                    alignItems:"center"
                  }}
                >

                  {log.flow!=null
                    ? <span style={{fontSize:10}}>🩸</span>
                    : <span
                        style={{
                          width:6,
                          height:6,
                          borderRadius:"50%",
                          background:"#C2185B",
                          display:"inline-block"
                        }}
                      />
                  }

                  {log.mood && (
  <span style={{ fontSize: 10 }}>
    {log.mood}
  </span>
)}

{log.energy != null && (
  <span
    title="Energy logged"
    style={{ fontSize: 9 }}
  >
    ⚡
  </span>
)}

{log.symptoms?.length > 0 && (
  <span
    title="Symptoms logged"
    style={{ fontSize: 9 }}
  >
    🤒
  </span>
)}

{log.notes && (
  <span
    title="Notes"
    style={{ fontSize: 9 }}
  >
    📝
  </span>
)}

                </div>

              )}

            </div>

          );

        })}

      </div>

      {/* Summary */}

            {/* Calendar Legend */}

      <div
        style={{
          marginTop: 20,
          padding: 16,
          background: "#fcfcfc",
          border: "1px solid #eee",
          borderRadius: 12
        }}
      >

        <div
          style={{
            fontWeight: 700,
            fontSize: 14,
            marginBottom: 12,
            color: "#444"
          }}
        >
          Your Calendar Guide
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 10
          }}
        >

          {/* Predicted Period */}

          <div style={{display:"flex",alignItems:"center",gap:8}}>
            <div
              style={{
                width:18,
                height:18,
                borderRadius:5,
                background:"#FCE4EC",
                border:"1px solid #F8BBD0"
              }}
            />
            <span style={{fontSize:13}}>Predicted Period</span>
          </div>

          {/* Fertile */}

          <div style={{display:"flex",alignItems:"center",gap:8}}>
            <div
              style={{
                width:18,
                height:18,
                borderRadius:5,
                background:"#E8F5E9",
                border:"1px solid #A5D6A7"
              }}
            />
            <span style={{fontSize:13}}>Fertile Window</span>
          </div>

          {/* Ovulation */}

          <div style={{display:"flex",alignItems:"center",gap:8}}>
            <div
              style={{
                width:18,
                height:18,
                borderRadius:5,
                background:"#FFE082",
                border:"1px solid #FFD54F"
              }}
            />
            <span style={{fontSize:13}}>Ovulation</span>
          </div>

          {/* Today */}

          <div style={{display:"flex",alignItems:"center",gap:8}}>
            <div
              style={{
                width:18,
                height:18,
                borderRadius:5,
                background:"#fff",
                border:"2px solid #C2185B"
              }}
            />
            <span style={{fontSize:13}}>Today</span>
          </div>

          {/* Selected */}

          <div style={{display:"flex",alignItems:"center",gap:8}}>
            <div
              style={{
                width:18,
                height:18,
                borderRadius:5,
                background:"#E1BEE7",
                border:"1px solid #CE93D8"
              }}
            />
            <span style={{fontSize:13}}>Selected Day</span>
          </div>

          {/* Logged Data */}

          <div style={{display:"flex",alignItems:"center",gap:8}}>
            <span style={{fontSize:16}}>🩸 😊 ⚡ 🤒 📝</span>
            <span style={{fontSize:13}}>Logged Data</span>
          </div>

        </div>

      </div>

      {selectedLogDate && logs[selectedLogDate] && (

        <div
          style={{
            marginTop:24,
            padding:16,
            borderRadius:12,
            background:"#fafafa",
            border:"1px solid #eee"
          }}
        >

          <h3 style={{marginBottom:12}}>
            📅 {formatDate(selectedLogDate)}
          </h3>

          {logs[selectedLogDate].flow!=null &&
            <p>
              🩸 {FLOW_LEVELS[logs[selectedLogDate].flow].label}
            </p>
          }

          {logs[selectedLogDate].mood &&
            <p>
              😊 {logs[selectedLogDate].mood}
            </p>
          }

          {logs[selectedLogDate].energy!=null &&
            <p>
              ⚡ {ENERGY_LEVELS[logs[selectedLogDate].energy]}
            </p>
          }

          {logs[selectedLogDate].symptoms?.length>0 &&
            <p>
              🤒 {logs[selectedLogDate].symptoms.join(", ")}
            </p>
          }

          {logs[selectedLogDate].notes &&
            <p>
              📝 {logs[selectedLogDate].notes}
            </p>
          }

        </div>

      )}

    </div>

  );

}
