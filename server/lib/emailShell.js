export const emailShell = (content) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
</head>
<body style="
  margin:0;
  padding:0;
  background:#0d0d0d;
  color:#f5f5f5;
  font-family:Arial, Helvetica, sans-serif;
">
  <div style="
    max-width:650px;
    margin:40px auto;
    background:#151515;
    border:1px solid #2a2a2a;
    border-radius:12px;
    overflow:hidden;
  ">

    <div style="
      background:#111;
      padding:24px;
      text-align:center;
      border-bottom:1px solid #2a2a2a;
    ">
      <h1 style="
        margin:0;
        color:#d4af37;
        font-size:28px;
      ">
        Le Charlot Limousine
      </h1>
    </div>

    <div style="padding:35px;">
      ${content}
    </div>

    <div style="
      padding:20px;
      text-align:center;
      color:#999;
      font-size:13px;
      border-top:1px solid #2a2a2a;
    ">
      © ${new Date().getFullYear()} Le Charlot Limousine. All rights reserved.
    </div>

  </div>
</body>
</html>
`;