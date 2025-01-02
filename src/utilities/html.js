export const html = `
  <div style="
    font-family: Arial, sans-serif;
    max-width: 600px;
    margin: 0 auto;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  ">
    <!-- Header Section -->
    <div style="
      background-color: #4A90E2;
      color: #ffffff;
      text-align: center;
      padding: 20px 10px;
    ">
      <h1 style="margin: 0; font-size: 24px;">Welcome to Wonder Craft!</h1>
    </div>

    <!-- Body Content -->
    <div style="padding: 20px;">
      <p style="font-size: 16px; line-height: 1.6; color: #333333;">
        Hello <strong>${name}</strong>,
      </p>
      <p style="font-size: 16px; line-height: 1.6; color: #555555;">
        We’re excited to have you onboard at <strong>Wonder Craft</strong>, your go-to platform for creativity and innovation.
      </p>
      <p style="font-size: 16px; line-height: 1.6; color: #555555;">
        Explore our platform, connect with fellow creators, and take your ideas to the next level!
      </p>

      <!-- CTA Button -->
      <div style="text-align: center; margin: 30px 0;">
        <a href="https://wondercraft.example.com" 
          style="
            text-decoration: none;
            padding: 10px 20px;
            background-color: #4A90E2;
            color: #ffffff;
            font-weight: bold;
            border-radius: 5px;
            font-size: 16px;
            display: inline-block;
          ">
          Get Started
        </a>
      </div>

      <!-- Thank You Note -->
      <p style="font-size: 16px; line-height: 1.6; color: #555555;">
        If you have any questions, feel free to reach out to us at 
        <a href="mailto:${
          process.env.USER
        }" style="color: #4A90E2; text-decoration: none;">
          ${process.env.USER}
        </a>.
      </p>
      <p style="font-size: 16px; line-height: 1.6; color: #555555;">
        Best Regards, <br />
        <strong>The Wonder Craft Team</strong>
      </p>
    </div>

    <!-- Footer -->
    <div style="
      background-color: #f4f4f4;
      text-align: center;
      padding: 10px 20px;
      color: #777777;
      font-size: 14px;
    ">
      <p style="margin: 0;">
        © ${new Date().getFullYear()} Wonder Craft. All Rights Reserved.
      </p>
    </div>
  </div>
  `;
