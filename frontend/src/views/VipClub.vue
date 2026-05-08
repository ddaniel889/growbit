<template>
  <div class="vip-page">

    <!-- HERO -->
    <section class="hero">
      <div class="hero-glow"></div>
      <div class="hero-dots"></div>
      <div class="hero-inner">
        <div class="vip-pill"><div class="pulse-dot"></div>VIP Program</div>
        <h1 class="hero-title">Enjoy a <span class="hl">VIP Experience</span></h1>
        <p class="hero-desc">
          BetSweeps' VIP program is designed to adapt to all different types of players,
          focusing on ensuring you receive the maximum in cumulative bonuses
          for every dollar you wager.
        </p>
      </div>
    </section>

    <!-- TRANSFER BANNER -->
    <div class="banner-wrap">
      <div class="transfer-banner">
        <div class="tb-left">
          <div class="tb-label">Exclusive Offer</div>
          <div class="tb-title">Best VIP Transfer Offer</div>
          <div class="tb-desc">Transfer your VIP status and receive a personalized wagering target with exclusive rewards.</div>
        </div>
        <div class="tb-right">
          <div class="tb-graphic">
            <!-- thumbs up -->
            <div class="tb-badge blue">
              <svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3H14z"/>
                <path d="M7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"/>
              </svg>
            </div>
            <!-- card -->
            <div class="tb-card">
              <div class="card-dots">
                <div class="card-dot"></div>
                <div class="card-dot"></div>
                <div class="card-dot"></div>
              </div>
              <div class="card-btm">
                <div class="card-chip"></div>
                <div class="card-star">
                  <svg viewBox="0 0 24 24" fill="rgba(255,255,255,0.8)" stroke="none">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                </div>
              </div>
            </div>
            <!-- trending up -->
            <div class="tb-badge indigo">
              <svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/>
                <polyline points="17 6 23 6 23 12"/>
              </svg>
            </div>
            <!-- bolt -->
            <div class="bolt">
              <svg viewBox="0 0 24 24" fill="#f5a623" stroke="none">
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
              </svg>
            </div>
          </div>
          <a href="https://t.me/betsweepsvip" target="_blank" class="btn-transfer">Contact VIP Manager</a>
        </div>
      </div>
    </div>

    <!-- GETTING STARTED -->
    <section class="section reveal" ref="revealSteps">
      <div class="sec-hd">
        <div class="sec-lbl">Onboarding</div>
        <h2 class="sec-title">Getting Started</h2>
        <div class="sec-line"></div>
      </div>
      <div class="steps-grid">
        <div class="step-card reveal reveal-d1" ref="step1">
          <div class="icon-ring">
            <svg viewBox="0 0 24 24" fill="none" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
              <circle cx="12" cy="7" r="4"/>
            </svg>
          </div>
          <div class="step-lbl">Step 1</div>
          <p class="step-txt">Register instantly and start wagering across a wide range of games at BetSweeps Casino.</p>
        </div>
        <div class="step-card reveal reveal-d2" ref="step2">
          <div class="icon-ring">
            <svg viewBox="0 0 24 24" fill="none" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/>
              <polyline points="17 6 23 6 23 12"/>
            </svg>
          </div>
          <div class="step-lbl">Step 2</div>
          <p class="step-txt">Earn XP with every bet and level up to unlock exciting new perks in our VIP Program.</p>
        </div>
        <div class="step-card reveal reveal-d3" ref="step3">
          <div class="icon-ring">
            <svg viewBox="0 0 24 24" fill="none" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="8" r="6"/>
              <path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/>
            </svg>
          </div>
          <div class="step-lbl">Step 3</div>
          <p class="step-txt">Redeem your rewards and enjoy the industry-leading premium VIP experience at BetSweeps.</p>
        </div>
      </div>
    </section>

    <div class="divider"></div>

    <!-- ADVANTAGES -->
    <section class="section">
      <div class="sec-hd reveal" ref="revealAdv">
        <div class="sec-lbl">Why VIP</div>
        <h2 class="sec-title">The Advantages</h2>
        <div class="sec-line"></div>
      </div>
      <div class="adv-grid">
        <div class="adv-card reveal reveal-d1" ref="adv1">
          <div class="adv-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.62 3.34 2 2 0 0 1 3.6 1.27h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.91a16 16 0 0 0 6 6l.91-.91a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21.73 16.92z"/>
            </svg>
          </div>
          <div>
            <div class="adv-title">24/7 Dedicated Support</div>
            <p class="adv-txt">We provide round-the-clock support to answer all your questions and help you get the most out of your BetSweeps experience.</p>
          </div>
        </div>
        <div class="adv-card reveal reveal-d2" ref="adv2">
          <div class="adv-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/>
              <polyline points="17 6 23 6 23 12"/>
            </svg>
          </div>
          <div>
            <div class="adv-title">Level Up &amp; Progress</div>
            <p class="adv-txt">We prioritize a rewarding level progression experience. The more consistently you play, the more we ensure you are recognized and rewarded.</p>
          </div>
        </div>
        <div class="adv-card reveal reveal-d3" ref="adv3">
          <div class="adv-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
            </svg>
          </div>
          <div>
            <div class="adv-title">Frequent Boosts &amp; Reloads</div>
            <p class="adv-txt">BetSweeps provides daily, weekly and monthly boosts. We also offer reloads during a losing streak or every time you level up.</p>
          </div>
        </div>
        <div class="adv-card reveal reveal-d4" ref="adv4">
          <div class="adv-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
            </svg>
          </div>
          <div>
            <div class="adv-title">Dedicated VIP Hosts</div>
            <p class="adv-txt">High-tier members receive a dedicated VIP host, including tailored bonuses and frequent reloads for an experience unlike any other.</p>
          </div>
        </div>
      </div>
    </section>

    <div class="divider"></div>

    <!-- BENEFITS TABLE -->
    <section class="section reveal" ref="revealTable">
      <div class="sec-hd">
        <div class="sec-lbl">Tiers</div>
        <h2 class="sec-title">The Benefits</h2>
        <div class="sec-line"></div>
      </div>
      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>VIP Rank</th>
              <th><span class="rb rb-br">Bronze</span></th>
              <th><span class="rb rb-sl">Silver</span></th>
              <th><span class="rb rb-go">Gold</span></th>
              <th><span class="rb rb-pl">Platinum</span></th>
              <th><span class="rb rb-ja">Jade</span></th>
              <th><span class="rb rb-sa">Sapphire</span></th>
              <th><span class="rb rb-ru">Ruby</span></th>
              <th><span class="rb rb-di">Diamond</span></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in benefitRows" :key="row.label">
              <td>{{ row.label }}</td>
              <td v-for="(has, i) in row.tiers" :key="i">
                <span v-if="has" class="tick">
                  <svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
                </span>
                <span v-else class="dash">—</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <div class="divider"></div>

    <!-- FAQ -->
    <section class="section reveal" ref="revealFaq">
      <div class="sec-hd">
        <div class="sec-lbl">Help</div>
        <h2 class="sec-title">Frequently Asked Questions</h2>
        <div class="sec-line"></div>
      </div>
      <div class="faq-list">

        <div class="faq-group" :class="{ open: openFaq.general }">
          <div class="faq-trigger" @click="toggleFaq('general')">
            General
            <svg class="ch" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <polyline points="6 9 12 15 18 9"/>
            </svg>
          </div>
          <div class="faq-body">
            <div class="faq-item" v-for="item in faqGeneral" :key="item.q">
              <div class="faq-q">{{ item.q }}</div>
              <div class="faq-a" v-html="item.a"></div>
            </div>
          </div>
        </div>

        <div class="faq-group" :class="{ open: openFaq.rakeback }">
          <div class="faq-trigger" @click="toggleFaq('rakeback')">
            Rakeback
            <svg class="ch" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <polyline points="6 9 12 15 18 9"/>
            </svg>
          </div>
          <div class="faq-body">
            <div class="faq-item" v-for="item in faqRakeback" :key="item.q">
              <div class="faq-q">{{ item.q }}</div>
              <div class="faq-a" v-html="item.a"></div>
            </div>
          </div>
        </div>

        <div class="faq-group" :class="{ open: openFaq.host }">
          <div class="faq-trigger" @click="toggleFaq('host')">
            VIP Host
            <svg class="ch" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <polyline points="6 9 12 15 18 9"/>
            </svg>
          </div>
          <div class="faq-body">
            <div class="faq-item" v-for="item in faqHost" :key="item.q">
              <div class="faq-q">{{ item.q }}</div>
              <div class="faq-a" v-html="item.a"></div>
            </div>
          </div>
        </div>

      </div>
    </section>

  </div>
</template>

<script>
export default {
  name: 'VipPage',

  data () {
    return {
      openFaq: {
        general: true,
        rakeback: false,
        host: false
      },

      // Benefits table — 8 tiers: Bronze Silver Gold Platinum Jade Sapphire Ruby Diamond
      benefitRows: [
        { label: 'Instant Rakeback',  tiers: [1,1,1,1,1,1,1,1] },
        { label: 'Weekly Bonus',      tiers: [1,1,1,1,1,1,1,1] },
        { label: 'Level-Up Bonus',    tiers: [1,1,1,1,1,1,1,1] },
        { label: 'Rank-Up Bonus',     tiers: [1,1,1,1,1,1,1,1] },
        { label: 'Monthly Bonus',     tiers: [0,1,1,1,1,1,1,1] },
        { label: 'Bonus Boost',       tiers: [0,1,1,1,1,1,1,1] },
        { label: 'VIP Host',          tiers: [0,0,0,0,0,1,1,1] },
        { label: 'Event Invitations', tiers: [0,0,0,0,0,0,1,1] }
      ],

      faqGeneral: [
        {
          q: 'What makes your VIP program the best in the industry?',
          a: 'The BetSweeps VIP program offers unparalleled exclusive rewards and premium personalized services for our most valued players. Our specialized VIP team prioritizes your needs and builds a custom rewards plan to maximize your experience.'
        },
        {
          q: 'What rewards can I expect as a VIP member?',
          a: `As a VIP member, you'll have access to:
              <ul>
                <li>Special bonuses and promotions</li>
                <li>Higher deposit and withdrawal limits</li>
                <li>Faster withdrawal processing</li>
                <li>Exclusive VIP events and tournaments</li>
                <li>Personalized gifts and experiences</li>
              </ul>`
        },
        {
          q: 'How do I become a VIP member?',
          a: 'Simply play regularly on BetSweeps and accumulate the required points for the VIP level. Once you reach the threshold, our VIP team will invite you to join and assist you in enjoying your benefits as soon as possible.'
        },
        {
          q: 'Is there a cost to join the VIP program?',
          a: 'Joining our VIP program is completely free. Qualifying is as simple as playing regularly and earning VIP points as a reward for your activity.'
        }
      ],

      faqRakeback: [
        {
          q: 'How is rakeback calculated?',
          a: 'Rakeback is a return of the fees you pay while playing at BetSweeps. It is calculated as a percentage of those fees, and the exact amount depends on your VIP level and total amount wagered.'
        },
        {
          q: 'What is instant rakeback?',
          a: 'Instant rakeback is credited to your account immediately after you pay a fee or commission. You can use it to keep playing or withdraw it right away without any waiting period.'
        },
        {
          q: 'What are weekly and monthly rakebacks?',
          a: 'Weekly and monthly rakebacks are fee returns credited to your account on a recurring basis. Both can be used to continue playing or withdrawn at your discretion.'
        },
        {
          q: 'What are reloads and how can they be claimed?',
          a: 'Reloads are bonuses added to your account when you make a deposit. They can be claimed by entering a bonus code provided by our VIP team when applicable.'
        }
      ],

      faqHost: [
        {
          q: 'What is a VIP host?',
          a: "VIP hosts are dedicated members of BetSweeps' support team who provide high-tier members with personalized, high-quality assistance and account management."
        },
        {
          q: 'What kind of support can I expect from a VIP host?',
          a: `Your host will provide personalized assistance including:
              <ul>
                <li>Account management</li>
                <li>Bonuses and promotions</li>
                <li>Technical support</li>
                <li>General inquiries</li>
              </ul>`
        },
        {
          q: 'Can I contact my VIP host at any time?',
          a: 'Yes, you can contact your VIP host at any time via phone, email, or live chat.'
        },
        {
          q: 'How am I assigned a VIP host?',
          a: 'Once you become a VIP member, a dedicated host will be assigned to you along with their contact information. You can reach out at any time with questions or concerns.'
        }
      ]
    }
  },

  methods: {
    toggleFaq (key) {
      this.openFaq[key] = !this.openFaq[key]
    },

    initScrollReveal () {
      const elements = this.$el.querySelectorAll('.reveal')
      if (!elements.length) return

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              entry.target.classList.add('visible')
              observer.unobserve(entry.target)
            }
          })
        },
        { threshold: 0.12 }
      )

      elements.forEach(el => observer.observe(el))
    }
  },

  mounted () {
    this.$nextTick(() => {
      this.initScrollReveal()
    })
  }
}
</script>

<style>
/* Google Fonts — add this to your index.html <head> if not already present:
   <link href="https://fonts.googleapis.com/css2?family=Exo+2:wght@400;500;600;700;800&family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
*/
@import url('https://fonts.googleapis.com/css2?family=Exo+2:wght@400;500;600;700;800&family=Inter:wght@400;500;600&display=swap');
</style>

<style scoped>
/* ─── CSS VARIABLES ─── */
.vip-page {
  --bg:      #0d1025;
  --bg2:     #111428;
  --card:    #161a35;
  --border:  #252a50;
  --accent:  #7c3aed;
  --accent2: #9d5cf6;
  --accent3: #5e21c8;
  --text:    #e8ecff;
  --muted:   #8892b0;
  --soft:    #c4c9e8;
  --gold:    #f5a623;

  font-family: 'Inter', sans-serif;
  background: var(--bg);
  color: var(--text);
  overflow-x: hidden;
  min-height: 100vh;
}

/* ─── SCROLL REVEAL ─── */
.reveal {
  opacity: 0;
  transform: translateY(26px);
  transition: opacity .65s cubic-bezier(.22,.68,0,1.15),
              transform .65s cubic-bezier(.22,.68,0,1.15);
}
.reveal.visible { opacity: 1; transform: translateY(0); }
.reveal-d1 { transition-delay: .07s; }
.reveal-d2 { transition-delay: .16s; }
.reveal-d3 { transition-delay: .25s; }
.reveal-d4 { transition-delay: .34s; }

/* ─── HERO ─── */
.hero {
  position: relative;
  padding: 100px 24px 84px;
  text-align: center;
  overflow: hidden;
}
.hero-glow {
  position: absolute; inset: 0; pointer-events: none;
  background:
    radial-gradient(ellipse 72% 55% at 50% -5%, rgba(124,58,237,.42) 0%, transparent 65%),
    radial-gradient(ellipse 38% 28% at 10% 110%, rgba(124,58,237,.10) 0%, transparent 60%),
    radial-gradient(ellipse 38% 28% at 90% 110%, rgba(124,58,237,.08) 0%, transparent 60%);
  animation: breathe 7s ease-in-out infinite;
}
@keyframes breathe {
  0%,100% { opacity:1; }
  50%      { opacity:.68; }
}
.hero-dots {
  position: absolute; inset: 0; pointer-events: none;
  background-image: radial-gradient(rgba(255,255,255,.06) 1px, transparent 1px);
  background-size: 38px 38px;
  -webkit-mask-image: radial-gradient(ellipse 80% 65% at 50% 0%, black 0%, transparent 78%);
  mask-image: radial-gradient(ellipse 80% 65% at 50% 0%, black 0%, transparent 78%);
}
.hero-inner { position: relative; max-width: 660px; margin: 0 auto; }

.vip-pill {
  display: inline-flex; align-items: center; gap: 8px;
  background: rgba(124,58,237,.16);
  border: 1px solid rgba(157,92,246,.38);
  border-radius: 100px; padding: 6px 18px;
  font-size: .72rem; font-weight: 700; letter-spacing: 2px;
  color: var(--accent2); text-transform: uppercase; margin-bottom: 24px;
  animation: fadeUp .7s cubic-bezier(.34,1.56,.64,1) .05s both;
}
.pulse-dot {
  width: 6px; height: 6px; border-radius: 50%;
  background: var(--accent2);
  animation: blink 2s infinite, glowPulse 2s infinite;
}
@keyframes blink { 0%,100%{opacity:1} 50%{opacity:.35} }
@keyframes glowPulse {
  0%,100%{ box-shadow:0 0 6px var(--accent2); }
  50%    { box-shadow:0 0 14px var(--accent2), 0 0 26px rgba(157,92,246,.4); }
}

.hero-title {
  font-family: 'Exo 2', sans-serif;
  font-size: clamp(2.2rem, 5vw, 3.6rem);
  font-weight: 800; line-height: 1.1; color: #fff;
  letter-spacing: -.5px; margin-bottom: 22px;
  animation: fadeUp .8s cubic-bezier(.22,.68,0,1.1) .18s both;
}
.hero-title .hl {
  background: linear-gradient(130deg, #a78bfa, #c084fc, var(--accent2));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
.hero-desc {
  font-size: 1.02rem; color: var(--muted);
  line-height: 1.75; max-width: 530px; margin: 0 auto 40px;
  animation: fadeUp .8s cubic-bezier(.22,.68,0,1.1) .32s both;
}
@keyframes fadeUp {
  from { opacity:0; transform:translateY(20px); }
  to   { opacity:1; transform:translateY(0); }
}

/* ─── TRANSFER BANNER ─── */
.banner-wrap { max-width: 1060px; margin: 0 auto 72px; padding: 0 24px; }
.transfer-banner {
  background: linear-gradient(115deg, #0f1230 0%, #1a1040 50%, #0f1230 100%);
  border: 1px solid rgba(124,58,237,.32);
  border-radius: 14px; padding: 24px 32px;
  display: flex; align-items: center; justify-content: space-between; gap: 24px;
  position: relative; overflow: hidden;
  animation: fadeUp .75s ease .08s both;
}
.transfer-banner::before {
  content: '';
  position: absolute; top: 0; left: 0; right: 0; height: 1px;
  background: linear-gradient(90deg, transparent 0%, rgba(157,92,246,.8) 50%, transparent 100%);
  background-size: 200% 100%;
  animation: shimmer 3.5s linear infinite;
}
@keyframes shimmer {
  0%   { background-position: -100% 0; }
  100% { background-position: 200% 0; }
}
.tb-left { flex: 1; }
.tb-label {
  font-size: .7rem; font-weight: 700; letter-spacing: 2px;
  color: var(--accent2); text-transform: uppercase; margin-bottom: 8px;
}
.tb-title { font-family: 'Exo 2', sans-serif; font-size: 1.15rem; font-weight: 700; color: #fff; margin-bottom: 6px; }
.tb-desc  { font-size: .88rem; color: var(--muted); line-height: 1.55; }
.tb-right { display: flex; align-items: center; gap: 20px; flex-shrink: 0; }
.tb-graphic { display: flex; align-items: center; gap: 10px; }
.tb-badge {
  width: 44px; height: 44px; border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
}
.tb-badge svg { width: 22px; height: 22px; }
.tb-badge.blue   { background: #2563eb; }
.tb-badge.indigo { background: #4338ca; }
.tb-card {
  width: 82px; height: 52px; border-radius: 9px;
  background: linear-gradient(135deg, #f59e0b, #d97706);
  box-shadow: 4px 6px 20px rgba(0,0,0,.5);
  transform: rotate(-6deg);
  display: flex; flex-direction: column; justify-content: space-between;
  padding: 7px 9px; position: relative; overflow: hidden;
}
.tb-card::after { content:''; position:absolute; top:17px; left:0; right:0; height:1px; background:rgba(255,255,255,.2); }
.card-dots { display:flex; gap:3px; }
.card-dot  { width:7px; height:4px; border-radius:1px; background:rgba(255,255,255,.55); }
.card-btm  { display:flex; justify-content:space-between; align-items:center; }
.card-chip { width:18px; height:13px; border-radius:3px; background:rgba(255,255,255,.28); border:1px solid rgba(255,255,255,.38); }
.card-star svg { width:11px; height:11px; }
.bolt svg  { width:20px; height:20px; animation: wiggle 3s ease-in-out infinite; }
@keyframes wiggle {
  0%,100%{ transform:rotate(0) scale(1); }
  20%    { transform:rotate(-12deg) scale(1.1); }
  40%    { transform:rotate(10deg)  scale(1.05); }
  60%    { transform:rotate(-5deg)  scale(1.08); }
  80%    { transform:rotate(3deg)   scale(1); }
}

.btn-transfer {
  background: linear-gradient(135deg, var(--accent3), var(--accent2));
  border: none; color: #fff;
  padding: 11px 26px; border-radius: 9px;
  font-family: 'Exo 2', sans-serif; font-weight: 700; font-size: .88rem;
  letter-spacing: .3px; cursor: pointer; white-space: nowrap;
  box-shadow: 0 0 20px rgba(124,58,237,.4);
  transition: opacity .2s, transform .2s;
  text-decoration: none; display: inline-block;
}
.btn-transfer:hover { opacity:.85; transform: translateY(-1px); }

/* ─── SHARED SECTION ─── */
.section { max-width: 1060px; margin: 0 auto; padding: 0 24px 80px; }
.sec-hd { text-align: center; margin-bottom: 52px; }
.sec-lbl {
  display: inline-block;
  font-size: .7rem; font-weight: 700; letter-spacing: 2.5px;
  color: var(--accent2); text-transform: uppercase; margin-bottom: 12px;
}
.sec-title {
  font-family: 'Exo 2', sans-serif;
  font-size: clamp(1.5rem,3vw,2rem); font-weight: 800; color: #fff;
}
.sec-line {
  width: 44px; height: 3px; margin: 14px auto 0;
  background: linear-gradient(90deg, var(--accent), var(--accent2));
  border-radius: 2px;
  animation: lineGrow .55s ease both;
}
@keyframes lineGrow {
  from { width:0; opacity:0; }
  to   { width:44px; opacity:1; }
}

/* ─── STEPS ─── */
.steps-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 20px; }
.step-card {
  background: var(--card); border: 1px solid var(--border);
  border-radius: 14px; padding: 38px 28px 32px;
  text-align: center; position: relative; overflow: hidden;
  transition: transform .25s, border-color .25s, box-shadow .25s;
}
.step-card::after {
  content: '';
  position: absolute; top: 0; left: 0; right: 0; height: 2px;
  background: linear-gradient(90deg, transparent, var(--accent2), transparent);
  opacity: 0; transition: opacity .3s;
}
.step-card:hover { transform: translateY(-6px); border-color: rgba(157,92,246,.42); box-shadow: 0 18px 44px rgba(124,58,237,.18); }
.step-card:hover::after { opacity: 1; }

.icon-ring {
  width: 60px; height: 60px; border-radius: 50%; margin: 0 auto 26px;
  background: rgba(124,58,237,.13);
  border: 1.5px solid rgba(157,92,246,.32);
  display: flex; align-items: center; justify-content: center;
  transition: transform .4s cubic-bezier(.34,1.56,.64,1), box-shadow .4s;
}
.icon-ring svg { width: 26px; height: 26px; stroke: var(--accent2); fill: none; stroke-width: 1.7; stroke-linecap: round; stroke-linejoin: round; }
.step-card:hover .icon-ring { transform: rotate(10deg) scale(1.1); box-shadow: 0 0 20px rgba(157,92,246,.38); }

.step-lbl { font-size: .7rem; font-weight: 700; letter-spacing: 2px; color: var(--accent2); text-transform: uppercase; margin-bottom: 12px; }
.step-txt { font-size: .91rem; color: var(--muted); line-height: 1.72; }

/* ─── DIVIDER ─── */
.divider { height: 1px; background: var(--border); max-width: 1060px; margin: 0 auto 72px; }

/* ─── ADVANTAGES ─── */
.adv-grid { display: grid; grid-template-columns: repeat(2,1fr); gap: 20px; }
.adv-card {
  background: var(--card); border: 1px solid var(--border);
  border-radius: 14px; padding: 28px 26px;
  display: flex; gap: 20px; align-items: flex-start;
  transition: transform .25s, border-color .25s;
}
.adv-card:hover { transform: translateY(-4px); border-color: rgba(157,92,246,.38); }
.adv-icon {
  flex-shrink: 0; width: 46px; height: 46px; border-radius: 10px;
  background: rgba(124,58,237,.13);
  border: 1px solid rgba(157,92,246,.24);
  display: flex; align-items: center; justify-content: center;
  transition: transform .35s cubic-bezier(.34,1.56,.64,1), background .3s;
}
.adv-icon svg { width: 22px; height: 22px; stroke: var(--accent2); fill: none; stroke-width: 1.7; stroke-linecap: round; stroke-linejoin: round; }
.adv-card:hover .adv-icon { transform: scale(1.12); background: rgba(124,58,237,.22); }
.adv-title { font-family: 'Exo 2', sans-serif; font-size: 1rem; font-weight: 700; color: #fff; margin-bottom: 9px; }
.adv-txt   { font-size: .88rem; color: var(--muted); line-height: 1.7; }

/* ─── TABLE ─── */
.table-wrap { overflow-x: auto; border-radius: 14px; border: 1px solid var(--border); }
table { width: 100%; border-collapse: collapse; background: var(--card); font-size: .86rem; min-width: 740px; }
thead tr { background: linear-gradient(135deg, rgba(124,58,237,.28), rgba(96,40,200,.16)); border-bottom: 1px solid var(--border); }
th { padding: 14px; text-align: center; font-family: 'Exo 2', sans-serif; font-size: .82rem; font-weight: 700; color: #fff; letter-spacing: .3px; white-space: nowrap; }
th:first-child { text-align: left; padding-left: 22px; }
tbody tr { border-bottom: 1px solid rgba(37,42,80,.7); transition: background .15s; }
tbody tr:last-child { border-bottom: none; }
tbody tr:hover { background: rgba(124,58,237,.06); }
td { padding: 12px 14px; text-align: center; color: var(--muted); }
td:first-child { text-align: left; padding-left: 22px; color: var(--soft); font-weight: 500; }
.dash { color: #2d3260; font-size: .9rem; }

.tick {
  display: inline-flex; align-items: center; justify-content: center;
  width: 18px; height: 18px; border-radius: 50%;
  background: rgba(124,58,237,.2); border: 1px solid rgba(157,92,246,.3);
}
.tick svg { width: 9px; height: 9px; stroke: var(--accent2); stroke-width: 2.8; fill: none; }
.tick svg polyline {
  stroke-dasharray: 22;
  stroke-dashoffset: 22;
  transition: stroke-dashoffset .35s ease .05s;
}
tr:hover .tick svg polyline { stroke-dashoffset: 0; }

.rb { display: inline-block; padding: 4px 11px; border-radius: 100px; font-size: .7rem; font-weight: 700; letter-spacing: .5px; font-family: 'Exo 2', sans-serif; white-space: nowrap; }
.rb-br  { background: rgba(180,83,9,.2);    color: #cd7c3a; border: 1px solid rgba(205,124,58,.28); }
.rb-sl  { background: rgba(148,163,184,.15); color: #94a3b8; border: 1px solid rgba(148,163,184,.28); }
.rb-go  { background: rgba(245,166,35,.18);  color: #f5a623; border: 1px solid rgba(245,166,35,.28); }
.rb-pl  { background: rgba(226,232,240,.1);  color: #cbd5e1; border: 1px solid rgba(226,232,240,.22); }
.rb-ja  { background: rgba(16,185,129,.18);  color: #10b981; border: 1px solid rgba(16,185,129,.28); }
.rb-sa  { background: rgba(59,130,246,.18);  color: #60a5fa; border: 1px solid rgba(59,130,246,.28); }
.rb-ru  { background: rgba(239,68,68,.18);   color: #f87171; border: 1px solid rgba(239,68,68,.28); }
.rb-di  { background: rgba(157,92,246,.2);   color: #c084fc; border: 1px solid rgba(157,92,246,.35); }

/* rank badge float animation */
thead .rb { animation: floatBadge 3.2s ease-in-out infinite; }
thead th:nth-child(2) .rb { animation-delay: .00s; }
thead th:nth-child(3) .rb { animation-delay: .18s; }
thead th:nth-child(4) .rb { animation-delay: .36s; }
thead th:nth-child(5) .rb { animation-delay: .54s; }
thead th:nth-child(6) .rb { animation-delay: .72s; }
thead th:nth-child(7) .rb { animation-delay: .90s; }
thead th:nth-child(8) .rb { animation-delay: 1.08s; }
thead th:nth-child(9) .rb { animation-delay: 1.26s; }
@keyframes floatBadge {
  0%,100%{ transform:translateY(0); }
  50%    { transform:translateY(-3px); }
}

/* ─── FAQ ─── */
.faq-list { display: flex; flex-direction: column; gap: 10px; }
.faq-group { background: var(--card); border: 1px solid var(--border); border-radius: 12px; overflow: hidden; }
.faq-trigger {
  display: flex; align-items: center; justify-content: space-between;
  padding: 18px 22px; cursor: pointer;
  font-family: 'Exo 2', sans-serif; font-size: 1rem; font-weight: 700; color: #fff;
  user-select: none; transition: background .2s;
}
.faq-trigger:hover { background: rgba(124,58,237,.08); }
.faq-trigger .ch { color: var(--accent2); flex-shrink: 0; transition: transform .35s cubic-bezier(.34,1.56,.64,1); }
.faq-group.open .faq-trigger .ch { transform: rotate(180deg); }
.faq-body { display: none; padding: 0 22px 20px; }
.faq-group.open .faq-body { display: block; }
.faq-item { padding: 15px 0; border-top: 1px solid var(--border); }
.faq-item:first-child { border-top: none; padding-top: 4px; }
.faq-q {
  font-weight: 600; color: var(--soft); font-size: .93rem; margin-bottom: 8px;
  display: flex; align-items: flex-start; gap: 10px;
}
.faq-q::before { content: ''; flex-shrink: 0; margin-top: 5px; width: 3px; height: 12px; background: var(--accent2); border-radius: 2px; }
.faq-a { font-size: .87rem; color: var(--muted); line-height: 1.72; padding-left: 13px; }
.faq-a ul { padding-left: 18px; margin-top: 6px; }
.faq-a li { margin-bottom: 4px; }

/* ─── RESPONSIVE ─── */
@media (max-width: 760px) {
  .steps-grid, .adv-grid { grid-template-columns: 1fr; }
  .transfer-banner { flex-direction: column; }
  .tb-graphic { display: none; }
}
</style>