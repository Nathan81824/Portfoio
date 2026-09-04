import {
  BarChart3,
  MessageCircle,
  Users,
  TrendingUp,
} from "lucide-react";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";



/* =========================================================
   ADMIN CHARTS

   Props:

   conversations
   → Conversations loaded from Supabase

   messages
   → Messages loaded from Supabase

   Shows:
   → Total conversations
   → Total messages
   → Visitor messages
   → Admin messages
   → Message activity chart
========================================================= */

export default function AdminCharts({
  conversations = [],
  messages = [],
}) {

  /* =======================================================
     TOTALS
  ======================================================= */

  const totalConversations =
    conversations.length;


  const totalMessages =
    messages.length;


  const visitorMessages =
    messages.filter(
      (message) =>
        message?.sender === "visitor"
    ).length;


  const adminMessages =
    messages.filter(
      (message) =>
        message?.sender === "admin"
    ).length;


  /* =======================================================
     LAST 7 DAYS
  ======================================================= */

  const now =
    new Date();


  const activityData =
    Array.from(
      { length: 7 },
      (_, index) => {

        const date =
          new Date(now);

        date.setDate(
          now.getDate() -
          (6 - index)
        );

        date.setHours(
          0,
          0,
          0,
          0
        );


        const nextDate =
          new Date(date);

        nextDate.setDate(
          date.getDate() + 1
        );


        const count =
          messages.filter(
            (message) => {

              if (
                !message?.created_at
              ) {
                return false;
              }


              const messageDate =
                new Date(
                  message.created_at
                );


              return (
                messageDate >= date &&
                messageDate < nextDate
              );

            }
          ).length;


        return {

          day:
            date.toLocaleDateString(
              "en-US",
              {
                weekday: "short",
              }
            ),

          messages:
            count,

        };

      }
    );


  /* =======================================================
     STAT CARDS
  ======================================================= */

  const stats = [

    {
      label:
        "Conversations",

      value:
        totalConversations,

      icon:
        Users,
    },

    {
      label:
        "Messages",

      value:
        totalMessages,

      icon:
        MessageCircle,
    },

    {
      label:
        "Visitor messages",

      value:
        visitorMessages,

      icon:
        TrendingUp,
    },

    {
      label:
        "Admin replies",

      value:
        adminMessages,

      icon:
        BarChart3,
    },

  ];


  /* =======================================================
     RENDER
  ======================================================= */

  return (

    <section className="admin-charts">

      {/* ===================================================
          HEADER
      =================================================== */}

      <div className="admin-charts-header">

        <div>

          <span className="admin-charts-label">
            ANALYTICS
          </span>

          <h2>
            Chat activity
          </h2>

          <p>
            Message activity over the
            last seven days.
          </p>

        </div>

      </div>


      {/* ===================================================
          STAT CARDS
      =================================================== */}

      <div className="admin-chart-stats">

        {stats.map(
          ({
            label,
            value,
            icon: Icon,
          }) => (

            <div
              key={label}
              className="admin-chart-stat"
            >

              <div className="admin-chart-stat-icon">

                <Icon
                  size={18}
                  strokeWidth={1.8}
                />

              </div>


              <div>

                <strong>
                  {value}
                </strong>

                <span>
                  {label}
                </span>

              </div>

            </div>

          )
        )}

      </div>


      {/* ===================================================
          CHART
      =================================================== */}

      <div className="admin-chart-card">

        <div className="admin-chart-card-header">

          <div>

            <span>
              ACTIVITY
            </span>

            <h3>
              Messages this week
            </h3>

          </div>

          <BarChart3
            size={20}
            strokeWidth={1.7}
          />

        </div>


        <div className="admin-chart">

          <ResponsiveContainer
            width="100%"
            height="100%"
          >

            <BarChart
              data={activityData}
              margin={{
                top: 10,
                right: 10,
                left: -20,
                bottom: 0,
              }}
            >

              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="rgba(255,255,255,0.06)"
              />

              <XAxis
                dataKey="day"
                axisLine={false}
                tickLine={false}
                tick={{
                  fill: "#707070",
                  fontSize: 11,
                }}
              />

              <YAxis
                allowDecimals={false}
                axisLine={false}
                tickLine={false}
                tick={{
                  fill: "#707070",
                  fontSize: 11,
                }}
              />

              <Tooltip
                cursor={{
                  fill:
                    "rgba(255,138,0,0.05)",
                }}
                contentStyle={{
                  background:
                    "#111111",
                  border:
                    "1px solid rgba(255,255,255,0.1)",
                  borderRadius:
                    "10px",
                  color:
                    "#ffffff",
                }}
              />

              <Bar
                dataKey="messages"
                radius={[
                  6,
                  6,
                  0,
                  0,
                ]}
                fill="#ff8a00"
              />

            </BarChart>

          </ResponsiveContainer>

        </div>

      </div>

    </section>

  );

}
