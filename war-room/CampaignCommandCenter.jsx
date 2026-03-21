import React, { useState } from "react";

const NAVY = "#1A3B69";
const DARK = "#0D1F3C";
const LIGHT_BLUE = "#BED2E3";
const PINK = "#FF2D78";
const YELLOW = "#FFC958";
const BG = "#F0F4F8";

const MOCK_CONTACTS = [
  { id: 1, first: "Maria", last: "Gonzalez", email: "maria.gonzalez@email.com", phone: "804-555-0101", type: "Volunteer", source: "Web Form", optEmail: true, optText: true },
  { id: 2, first: "James", last: "Henderson", email: "james.h@email.com", phone: "804-555-0202", type: "Donor", source: "Event Signup", optEmail: true, optText: false },
  { id: 3, first: "Patricia", last: "Nguyen", email: "p.nguyen@email.com", phone: "804-555-0303", type: "Yard Sign", source: "Door Knock", optEmail: true, optText: true },
  { id: 4, first: "Robert", last: "Williams", email: "rwilliams@email.com", phone: "804-555-0404", type: "Delegate", source: "Phone Bank", optEmail: false, optText: true },
  { id: 5, first: "Susan", last: "Park", email: "susan.park@email.com", phone: "804-555-0505", type: "Supporter", source: "Referral", optEmail: true, optText: true },
];

const MOCK_STATS = {
  totalContacts: 247,
  donors: 34,
  totalRaised: 4850,
  volunteers: 52,
  delegatesContacted: 18,
  yardSigns: 67,
  yardSignsDelivered: 41,
  commsSent: 12,
};

const TABS = [
  { key: "dashboard", label: "Dashboard", icon: "\uD83D\uDCCA" },
  { key: "contacts", label: "Contacts", icon: "\uD83D\uDC65" },
  { key: "forms", label: "Forms", icon: "\uD83D\uDCCB" },
  { key: "email", label: "Email", icon: "\u2709\uFE0F" },
  { key: "text", label: "Text", icon: "\uD83D\uDCF1" },
  { key: "settings", label: "Settings", icon: "\u2699\uFE0F" },
];

const TYPE_COLORS = {
  Volunteer: "#2E7D32",
  Donor: "#C62828",
  "Yard Sign": "#F57F17",
  Delegate: NAVY,
  Supporter: PINK,
};

function StatCard({ label, value, accent, sub }) {
  return (
    <div
      style={{
        background: "#FFFFFF",
        borderRadius: 12,
        padding: "20px 24px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.07)",
        borderTop: `4px solid ${accent || NAVY}`,
        minWidth: 160,
        flex: "1 1 180px",
      }}
    >
      <div style={{ fontSize: 13, color: "#6B7B8D", fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5 }}>
        {label}
      </div>
      <div style={{ fontSize: 32, fontWeight: 700, color: DARK, marginTop: 4 }}>{value}</div>
      {sub && <div style={{ fontSize: 12, color: "#8899AA", marginTop: 4 }}>{sub}</div>}
    </div>
  );
}

function DashboardView() {
  const delegateData = [
    { label: "Strong Support", count: 8, color: "#2E7D32" },
    { label: "Leaning", count: 6, color: "#66BB6A" },
    { label: "Undecided", count: 12, color: YELLOW },
    { label: "Leaning Opponent", count: 4, color: "#EF6C00" },
    { label: "Strong Opponent", count: 3, color: "#C62828" },
    { label: "Not Contacted", count: 9, color: "#9E9E9E" },
  ];
  const totalDelegates = delegateData.reduce(function (s, d) { return s + d.count; }, 0);

  return (
    <div>
      <h2 style={{ margin: "0 0 20px", color: DARK, fontSize: 22 }}>Campaign Overview</h2>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 16, marginBottom: 32 }}>
        <StatCard label="Total Contacts" value={MOCK_STATS.totalContacts} accent={NAVY} />
        <StatCard label="Donors" value={MOCK_STATS.donors} accent="#C62828" sub={`$${MOCK_STATS.totalRaised.toLocaleString()} raised`} />
        <StatCard label="Total Raised" value={`$${MOCK_STATS.totalRaised.toLocaleString()}`} accent="#2E7D32" />
        <StatCard label="Volunteers" value={MOCK_STATS.volunteers} accent={PINK} />
        <StatCard label="Delegates Contacted" value={MOCK_STATS.delegatesContacted} accent={NAVY} sub="of 42 total" />
        <StatCard label="Yard Signs" value={MOCK_STATS.yardSigns} accent={YELLOW} sub={`${MOCK_STATS.yardSignsDelivered} delivered`} />
        <StatCard label="Comms Sent" value={MOCK_STATS.commsSent} accent={LIGHT_BLUE} sub="emails + texts" />
      </div>

      <h3 style={{ margin: "0 0 12px", color: DARK, fontSize: 18 }}>Quick Actions</h3>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginBottom: 32 }}>
        {["Send Email Blast", "Send Text Blast", "Add Contact", "View Forms"].map(function (action) {
          return (
            <button
              key={action}
              style={{
                padding: "10px 20px",
                background: NAVY,
                color: "#FFFFFF",
                border: "none",
                borderRadius: 8,
                fontWeight: 600,
                fontSize: 14,
                cursor: "pointer",
              }}
            >
              {action}
            </button>
          );
        })}
      </div>

      <h3 style={{ margin: "0 0 16px", color: DARK, fontSize: 18 }}>Delegate Support Breakdown</h3>
      <div style={{ background: "#FFFFFF", borderRadius: 12, padding: 24, boxShadow: "0 2px 8px rgba(0,0,0,0.07)" }}>
        {delegateData.map(function (d) {
          var pct = Math.round((d.count / totalDelegates) * 100);
          return (
            <div key={d.label} style={{ marginBottom: 14 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, fontWeight: 600, color: DARK, marginBottom: 4 }}>
                <span>{d.label}</span>
                <span>{d.count} ({pct}%)</span>
              </div>
              <div style={{ background: "#E8EDF2", borderRadius: 6, height: 22, overflow: "hidden" }}>
                <div
                  style={{
                    width: pct + "%",
                    height: "100%",
                    background: d.color,
                    borderRadius: 6,
                    transition: "width 0.4s ease",
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ContactsView() {
  var filterOptions = ["All", "Supporter", "Volunteer", "Donor", "Delegate", "Yard Sign"];
  var _search = useState("");
  var search = _search[0];
  var setSearch = _search[1];
  var _filter = useState("All");
  var activeFilter = _filter[0];
  var setActiveFilter = _filter[1];

  var filtered = MOCK_CONTACTS.filter(function (c) {
    var matchesFilter = activeFilter === "All" || c.type === activeFilter;
    var matchesSearch =
      search === "" ||
      (c.first + " " + c.last).toLowerCase().indexOf(search.toLowerCase()) !== -1 ||
      c.email.toLowerCase().indexOf(search.toLowerCase()) !== -1;
    return matchesFilter && matchesSearch;
  });

  return (
    <div>
      <h2 style={{ margin: "0 0 20px", color: DARK, fontSize: 22 }}>Contacts</h2>

      <input
        type="text"
        placeholder="Search contacts..."
        value={search}
        onChange={function (e) { setSearch(e.target.value); }}
        style={{
          width: "100%",
          padding: "10px 16px",
          border: "2px solid " + LIGHT_BLUE,
          borderRadius: 8,
          fontSize: 14,
          marginBottom: 16,
          boxSizing: "border-box",
          outline: "none",
        }}
      />

      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 20 }}>
        {filterOptions.map(function (f) {
          var isActive = f === activeFilter;
          return (
            <button
              key={f}
              onClick={function () { setActiveFilter(f); }}
              style={{
                padding: "6px 16px",
                borderRadius: 20,
                border: isActive ? "2px solid " + PINK : "2px solid " + LIGHT_BLUE,
                background: isActive ? PINK : "#FFFFFF",
                color: isActive ? "#FFFFFF" : DARK,
                fontWeight: 600,
                fontSize: 13,
                cursor: "pointer",
              }}
            >
              {f}
            </button>
          );
        })}
      </div>

      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", background: "#FFFFFF", borderRadius: 12, overflow: "hidden", boxShadow: "0 2px 8px rgba(0,0,0,0.07)" }}>
          <thead>
            <tr style={{ background: NAVY, color: "#FFFFFF" }}>
              {["Name", "Email", "Phone", "Type", "Source", "Email Opt-in", "Text Opt-in"].map(function (h) {
                return (
                  <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontSize: 13, fontWeight: 600 }}>{h}</th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {filtered.map(function (c) {
              return (
                <tr key={c.id} style={{ borderBottom: "1px solid #E8EDF2" }}>
                  <td style={{ padding: "10px 16px", fontSize: 14, fontWeight: 600, color: DARK }}>{c.first} {c.last}</td>
                  <td style={{ padding: "10px 16px", fontSize: 14, color: "#5A6B7D" }}>{c.email}</td>
                  <td style={{ padding: "10px 16px", fontSize: 14, color: "#5A6B7D" }}>{c.phone}</td>
                  <td style={{ padding: "10px 16px" }}>
                    <span
                      style={{
                        display: "inline-block",
                        padding: "3px 12px",
                        borderRadius: 12,
                        background: (TYPE_COLORS[c.type] || NAVY) + "1A",
                        color: TYPE_COLORS[c.type] || NAVY,
                        fontSize: 12,
                        fontWeight: 700,
                      }}
                    >
                      {c.type}
                    </span>
                  </td>
                  <td style={{ padding: "10px 16px", fontSize: 14, color: "#5A6B7D" }}>{c.source}</td>
                  <td style={{ padding: "10px 16px", fontSize: 14, textAlign: "center" }}>{c.optEmail ? "\u2705" : "\u274C"}</td>
                  <td style={{ padding: "10px 16px", fontSize: 14, textAlign: "center" }}>{c.optText ? "\u2705" : "\u274C"}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div style={{ marginTop: 12, fontSize: 13, color: "#8899AA" }}>
        Showing {filtered.length} of {MOCK_CONTACTS.length} contacts (mock data) | {MOCK_STATS.totalContacts} total in Google Sheet
      </div>
    </div>
  );
}

function FormsView() {
  var formDefs = [
    {
      key: "involve",
      title: "Get Involved",
      icon: "\uD83E\uDD1D",
      desc: "Volunteer signup form",
      slug: "get-involved",
      fields: [
        { name: "first_name", label: "First Name", type: "text", required: true },
        { name: "last_name", label: "Last Name", type: "text", required: true },
        { name: "email", label: "Email", type: "email", required: true },
        { name: "phone", label: "Phone", type: "tel", required: false },
        { name: "interests", label: "I can help with...", type: "select", required: true, options: ["Door Knocking", "Phone Banking", "Event Setup", "Social Media", "Data Entry", "Other"] },
        { name: "availability", label: "Availability", type: "select", required: false, options: ["Weekday Mornings", "Weekday Evenings", "Weekends", "Flexible"] },
      ],
    },
    {
      key: "yardsign",
      title: "Request Yard Sign",
      icon: "\uD83E\uDEA7",
      desc: "Yard sign request form",
      slug: "yard-sign",
      fields: [
        { name: "first_name", label: "First Name", type: "text", required: true },
        { name: "last_name", label: "Last Name", type: "text", required: true },
        { name: "address", label: "Street Address", type: "text", required: true },
        { name: "city", label: "City", type: "text", required: true },
        { name: "zip", label: "ZIP Code", type: "text", required: true },
        { name: "phone", label: "Phone", type: "tel", required: false },
        { name: "email", label: "Email", type: "email", required: true },
      ],
    },
    {
      key: "contact",
      title: "Contact Kara",
      icon: "\uD83D\uDCEC",
      desc: "General contact form",
      slug: "contact",
      fields: [
        { name: "first_name", label: "First Name", type: "text", required: true },
        { name: "last_name", label: "Last Name", type: "text", required: true },
        { name: "email", label: "Email", type: "email", required: true },
        { name: "subject", label: "Subject", type: "text", required: true },
        { name: "message", label: "Message", type: "textarea", required: true },
      ],
    },
    {
      key: "donate",
      title: "Donate",
      icon: "\uD83D\uDCB5",
      desc: "Donation form",
      slug: "donate",
      fields: [
        { name: "first_name", label: "First Name", type: "text", required: true },
        { name: "last_name", label: "Last Name", type: "text", required: true },
        { name: "email", label: "Email", type: "email", required: true },
        { name: "amount", label: "Amount ($)", type: "number", required: true },
        { name: "employer", label: "Employer", type: "text", required: true },
        { name: "occupation", label: "Occupation", type: "text", required: true },
      ],
    },
  ];

  var _activeForm = useState(null);
  var activeForm = _activeForm[0];
  var setActiveForm = _activeForm[1];
  var _submitted = useState(false);
  var submitted = _submitted[0];
  var setSubmitted = _submitted[1];

  function handleSubmit(e) {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(function () {
      setSubmitted(false);
      setActiveForm(null);
    }, 2500);
  }

  if (activeForm) {
    var form = formDefs.find(function (f) { return f.key === activeForm; });
    if (!form) return null;

    if (submitted) {
      return (
        <div style={{ textAlign: "center", padding: 60 }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>{"\u2705"}</div>
          <h2 style={{ color: DARK, margin: "0 0 8px" }}>Submitted Successfully!</h2>
          <p style={{ color: "#6B7B8D" }}>Thank you! Your response has been recorded.</p>
        </div>
      );
    }

    return (
      <div>
        <button
          onClick={function () { setActiveForm(null); }}
          style={{ background: "none", border: "none", color: NAVY, fontWeight: 600, fontSize: 14, cursor: "pointer", marginBottom: 16, padding: 0 }}
        >
          {"\u2190"} Back to Forms
        </button>
        <div style={{ background: "#FFFFFF", borderRadius: 12, padding: 32, boxShadow: "0 2px 8px rgba(0,0,0,0.07)", maxWidth: 560 }}>
          <h2 style={{ margin: "0 0 4px", color: DARK }}>{form.icon} {form.title}</h2>
          <p style={{ color: "#6B7B8D", margin: "0 0 24px", fontSize: 14 }}>{form.desc}</p>
          <form onSubmit={handleSubmit}>
            {form.fields.map(function (field) {
              var labelEl = (
                <label key={field.name + "-label"} style={{ display: "block", fontSize: 13, fontWeight: 600, color: DARK, marginBottom: 4 }}>
                  {field.label} {field.required && <span style={{ color: PINK }}>*</span>}
                </label>
              );
              var inputStyle = {
                width: "100%",
                padding: "10px 14px",
                border: "2px solid " + LIGHT_BLUE,
                borderRadius: 8,
                fontSize: 14,
                boxSizing: "border-box",
                outline: "none",
                marginBottom: 16,
              };

              if (field.type === "textarea") {
                return (
                  <div key={field.name}>
                    {labelEl}
                    <textarea required={field.required} rows={4} style={{...inputStyle}} />
                  </div>
                );
              }
              if (field.type === "select") {
                return (
                  <div key={field.name}>
                    {labelEl}
                    <select required={field.required} style={{...inputStyle}}>
                      <option value="">Select...</option>
                      {field.options.map(function (o) { return <option key={o} value={o}>{o}</option>; })}
                    </select>
                  </div>
                );
              }
              return (
                <div key={field.name}>
                  {labelEl}
                  <input type={field.type} required={field.required} style={{...inputStyle}} />
                </div>
              );
            })}
            <button
              type="submit"
              style={{
                padding: "12px 32px",
                background: PINK,
                color: "#FFFFFF",
                border: "none",
                borderRadius: 8,
                fontWeight: 700,
                fontSize: 15,
                cursor: "pointer",
                marginTop: 8,
              }}
            >
              Submit
            </button>
          </form>
        </div>

        <div style={{ marginTop: 32, background: "#FFFFFF", borderRadius: 12, padding: 24, boxShadow: "0 2px 8px rgba(0,0,0,0.07)" }}>
          <h3 style={{ margin: "0 0 12px", color: DARK, fontSize: 16 }}>Embed Code</h3>
          <p style={{ fontSize: 13, color: "#6B7B8D", margin: "0 0 12px" }}>
            Add this form to your Cloudflare Pages site:
          </p>
          <pre
            style={{
              background: DARK,
              color: LIGHT_BLUE,
              padding: 16,
              borderRadius: 8,
              fontSize: 12,
              overflowX: "auto",
              lineHeight: 1.6,
            }}
          >
{`<!-- ${form.title} Form -->
<iframe
  src="https://kara-toone.pages.dev/forms/${form.slug}"
  width="100%"
  height="600"
  frameborder="0"
  style="border: none; border-radius: 12px;"
></iframe>

<!-- Or link directly -->
<a href="https://kara-toone.pages.dev/forms/${form.slug}">
  ${form.title}
</a>`}
          </pre>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2 style={{ margin: "0 0 20px", color: DARK, fontSize: 22 }}>Forms</h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 16 }}>
        {formDefs.map(function (form) {
          return (
            <div
              key={form.key}
              onClick={function () { setActiveForm(form.key); }}
              style={{
                background: "#FFFFFF",
                borderRadius: 12,
                padding: 24,
                boxShadow: "0 2px 8px rgba(0,0,0,0.07)",
                cursor: "pointer",
                transition: "transform 0.15s ease",
                border: "2px solid transparent",
              }}
              onMouseEnter={function (e) { e.currentTarget.style.borderColor = PINK; }}
              onMouseLeave={function (e) { e.currentTarget.style.borderColor = "transparent"; }}
            >
              <div style={{ fontSize: 36, marginBottom: 12 }}>{form.icon}</div>
              <h3 style={{ margin: "0 0 6px", color: DARK, fontSize: 17 }}>{form.title}</h3>
              <p style={{ margin: 0, color: "#6B7B8D", fontSize: 13 }}>{form.desc}</p>
              <div style={{ marginTop: 12, fontSize: 12, color: NAVY, fontWeight: 600 }}>
                {form.fields.length} fields {"\u2192"}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function BlastView({ type }) {
  var isEmail = type === "email";

  var audiences = [
    { key: "all", label: "All opt-ins", count: isEmail ? 198 : 173 },
    { key: "volunteers", label: "Volunteers", count: isEmail ? 48 : 41 },
    { key: "donors", label: "Donors", count: isEmail ? 32 : 22 },
    { key: "delegates", label: "Delegates", count: isEmail ? 18 : 15 },
    { key: "yardsign", label: "Yard Sign", count: isEmail ? 64 : 58 },
  ];

  var _audience = useState("all");
  var audience = _audience[0];
  var setAudience = _audience[1];
  var _subject = useState("");
  var subject = _subject[0];
  var setSubject = _subject[1];
  var _message = useState("");
  var message = _message[0];
  var setMessage = _message[1];
  var _sending = useState(false);
  var sending = _sending[0];
  var setSending = _sending[1];
  var _sent = useState(false);
  var sent = _sent[0];
  var setSent = _sent[1];

  var selectedAudience = audiences.find(function (a) { return a.key === audience; });
  var recipientCount = selectedAudience ? selectedAudience.count : 0;
  var textLimit = 160;

  function handleSend() {
    setSending(true);
    setTimeout(function () {
      setSending(false);
      setSent(true);
      setTimeout(function () { setSent(false); }, 3000);
    }, 2000);
  }

  if (sent) {
    return (
      <div style={{ textAlign: "center", padding: 60 }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>{"\u2705"}</div>
        <h2 style={{ color: DARK, margin: "0 0 8px" }}>
          {isEmail ? "Emails" : "Texts"} Sent Successfully!
        </h2>
        <p style={{ color: "#6B7B8D" }}>
          {recipientCount} {isEmail ? "emails" : "text messages"} have been queued for delivery.
        </p>
      </div>
    );
  }

  return (
    <div>
      <h2 style={{ margin: "0 0 20px", color: DARK, fontSize: 22 }}>
        {isEmail ? "\u2709\uFE0F Send Email Blast" : "\uD83D\uDCF1 Send Text Blast"}
      </h2>

      <div style={{ background: "#FFFFFF", borderRadius: 12, padding: 24, boxShadow: "0 2px 8px rgba(0,0,0,0.07)", marginBottom: 20 }}>
        <h3 style={{ margin: "0 0 14px", color: DARK, fontSize: 16 }}>Select Audience</h3>
        {audiences.map(function (a) {
          return (
            <label
              key={a.key}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "8px 12px",
                borderRadius: 8,
                marginBottom: 6,
                background: audience === a.key ? NAVY + "0D" : "transparent",
                cursor: "pointer",
              }}
            >
              <input
                type="radio"
                name="audience"
                checked={audience === a.key}
                onChange={function () { setAudience(a.key); }}
                style={{ accentColor: PINK }}
              />
              <span style={{ fontSize: 14, fontWeight: 600, color: DARK, flex: 1 }}>{a.label}</span>
              <span style={{ fontSize: 13, color: "#6B7B8D", background: LIGHT_BLUE, padding: "2px 10px", borderRadius: 10 }}>
                {a.count}
              </span>
            </label>
          );
        })}
      </div>

      <div style={{ background: "#FFFFFF", borderRadius: 12, padding: 24, boxShadow: "0 2px 8px rgba(0,0,0,0.07)", marginBottom: 20 }}>
        <h3 style={{ margin: "0 0 14px", color: DARK, fontSize: 16 }}>Compose Message</h3>

        {isEmail && (
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: DARK, marginBottom: 4 }}>Subject Line</label>
            <input
              type="text"
              value={subject}
              onChange={function (e) { setSubject(e.target.value); }}
              placeholder="Enter email subject..."
              style={{
                width: "100%",
                padding: "10px 14px",
                border: "2px solid " + LIGHT_BLUE,
                borderRadius: 8,
                fontSize: 14,
                boxSizing: "border-box",
                outline: "none",
              }}
            />
          </div>
        )}

        <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: DARK, marginBottom: 4 }}>Message</label>
        <textarea
          value={message}
          onChange={function (e) { setMessage(e.target.value); }}
          placeholder={isEmail ? "Compose your email..." : "Compose your text message..."}
          rows={isEmail ? 8 : 4}
          maxLength={isEmail ? undefined : textLimit}
          style={{
            width: "100%",
            padding: "10px 14px",
            border: "2px solid " + LIGHT_BLUE,
            borderRadius: 8,
            fontSize: 14,
            boxSizing: "border-box",
            outline: "none",
            resize: "vertical",
            fontFamily: "inherit",
          }}
        />
        {!isEmail && (
          <div style={{ fontSize: 12, color: message.length > textLimit - 20 ? PINK : "#8899AA", textAlign: "right", marginTop: 4 }}>
            {message.length}/{textLimit} characters
          </div>
        )}

        <div style={{ marginTop: 12, padding: 12, background: BG, borderRadius: 8, fontSize: 13, color: "#5A6B7D" }}>
          <strong>Merge Fields:</strong> {"{first_name}"}, {"{last_name}"}, {"{precinct}"}
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
        <button
          onClick={handleSend}
          disabled={sending || (!isEmail && message.length === 0) || (isEmail && (subject.length === 0 || message.length === 0))}
          style={{
            padding: "14px 32px",
            background: sending ? "#8899AA" : PINK,
            color: "#FFFFFF",
            border: "none",
            borderRadius: 8,
            fontWeight: 700,
            fontSize: 15,
            cursor: sending ? "default" : "pointer",
            opacity: sending ? 0.7 : 1,
          }}
        >
          {sending ? "Sending..." : `Send to ${recipientCount} ${isEmail ? "emails" : "phones"}`}
        </button>
        <span style={{ fontSize: 13, color: "#6B7B8D" }}>
          {isEmail
            ? "Cost estimate: Free via Resend (up to 3,000/mo)"
            : `Cost estimate: ~$${(recipientCount * 0.008).toFixed(2)} via Twilio ($0.008/text)`}
        </span>
      </div>
    </div>
  );
}

function SettingsView() {
  var fields = [
    { key: "sheetId", label: "Google Sheet ID", placeholder: "1aBcDeFgHiJkLmNoPqRsTuVwXyZ", type: "text" },
    { key: "resendKey", label: "Resend API Key", placeholder: "re_xxxxxxxxxxxx", type: "password" },
    { key: "twilioSid", label: "Twilio Account SID", placeholder: "ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx", type: "password" },
    { key: "twilioAuth", label: "Twilio Auth Token", placeholder: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx", type: "password" },
    { key: "twilioPhone", label: "Twilio Phone Number", placeholder: "+18045551234", type: "text" },
    { key: "fromEmail", label: "From Email", placeholder: "kara@karatoone.com", type: "email" },
  ];

  var _config = useState({});
  var config = _config[0];
  var setConfig = _config[1];

  return (
    <div>
      <h2 style={{ margin: "0 0 20px", color: DARK, fontSize: 22 }}>Settings</h2>

      <div style={{ background: "#FFFFFF", borderRadius: 12, padding: 32, boxShadow: "0 2px 8px rgba(0,0,0,0.07)", maxWidth: 560, marginBottom: 24 }}>
        {fields.map(function (field) {
          return (
            <div key={field.key} style={{ marginBottom: 18 }}>
              <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: DARK, marginBottom: 4 }}>{field.label}</label>
              <input
                type={field.type}
                placeholder={field.placeholder}
                value={config[field.key] || ""}
                onChange={function (e) {
                  var update = {};
                  update[field.key] = e.target.value;
                  setConfig(function (prev) { return Object.assign({}, prev, update); });
                }}
                style={{
                  width: "100%",
                  padding: "10px 14px",
                  border: "2px solid " + LIGHT_BLUE,
                  borderRadius: 8,
                  fontSize: 14,
                  boxSizing: "border-box",
                  outline: "none",
                  fontFamily: "monospace",
                }}
              />
            </div>
          );
        })}

        <button
          style={{
            padding: "12px 28px",
            background: NAVY,
            color: "#FFFFFF",
            border: "none",
            borderRadius: 8,
            fontWeight: 700,
            fontSize: 14,
            cursor: "pointer",
            marginTop: 8,
          }}
        >
          Save Settings
        </button>
      </div>

      <div style={{ background: DARK, borderRadius: 12, padding: 24, maxWidth: 560 }}>
        <h3 style={{ margin: "0 0 12px", color: YELLOW, fontSize: 15 }}>{"\u26A0\uFE0F"} Architecture Note</h3>
        <p style={{ margin: 0, color: LIGHT_BLUE, fontSize: 13, lineHeight: 1.7 }}>
          In production, API keys and secrets are stored as <strong style={{ color: "#FFFFFF" }}>Cloudflare Worker environment variables</strong> (encrypted at rest), never in client-side code. The settings above are for local development reference only. Use <code style={{ background: "rgba(255,255,255,0.1)", padding: "2px 6px", borderRadius: 4 }}>wrangler secret put</code> to set secrets in production.
        </p>
      </div>
    </div>
  );
}

export default function CampaignCommandCenter() {
  var _tab = useState("dashboard");
  var activeTab = _tab[0];
  var setActiveTab = _tab[1];

  function renderContent() {
    switch (activeTab) {
      case "dashboard":
        return <DashboardView />;
      case "contacts":
        return <ContactsView />;
      case "forms":
        return <FormsView />;
      case "email":
        return <BlastView type="email" />;
      case "text":
        return <BlastView type="text" />;
      case "settings":
        return <SettingsView />;
      default:
        return <DashboardView />;
    }
  }

  return (
    <div style={{ minHeight: "100vh", background: BG, fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
      <header style={{ background: DARK, padding: "20px 32px", display: "flex", alignItems: "center", gap: 16 }}>
        <div
          style={{
            width: 44,
            height: 44,
            borderRadius: 10,
            background: "linear-gradient(135deg, " + PINK + ", " + YELLOW + ")",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: 800,
            fontSize: 22,
            color: "#FFFFFF",
            flexShrink: 0,
          }}
        >
          K
        </div>
        <div style={{ flex: 1 }}>
          <h1 style={{ margin: 0, fontSize: 20, color: "#FFFFFF", fontWeight: 700 }}>Campaign Command Center</h1>
          <div style={{ fontSize: 11, color: LIGHT_BLUE, fontWeight: 600, letterSpacing: 1.5, marginTop: 2 }}>
            KARA TOONE {"\u2022"} LEG 14 {"\u2022"} 2026
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#4CAF50" }} />
          <span style={{ fontSize: 12, color: "#4CAF50", fontWeight: 600 }}>Connected to Google Sheet</span>
        </div>
      </header>

      <nav style={{ background: "#FFFFFF", borderBottom: "1px solid #E0E7EE", padding: "0 32px", display: "flex", gap: 0, overflowX: "auto" }}>
        {TABS.map(function (tab) {
          var isActive = tab.key === activeTab;
          return (
            <button
              key={tab.key}
              onClick={function () { setActiveTab(tab.key); }}
              style={{
                padding: "14px 20px",
                background: "none",
                border: "none",
                borderBottom: isActive ? "3px solid " + PINK : "3px solid transparent",
                color: isActive ? DARK : "#8899AA",
                fontWeight: isActive ? 700 : 500,
                fontSize: 14,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 6,
                whiteSpace: "nowrap",
                transition: "all 0.15s ease",
              }}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          );
        })}
      </nav>

      <main style={{ padding: 32, maxWidth: 1100, margin: "0 auto" }}>
        {renderContent()}
      </main>

      <footer style={{ textAlign: "center", padding: "24px 32px", borderTop: "1px solid #E0E7EE", fontSize: 12, color: "#8899AA" }}>
        Powered by Cloudflare Workers {"\u2022"} Google Sheets {"\u2022"} Resend {"\u2022"} Twilio
      </footer>
    </div>
  );
}
