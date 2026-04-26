<template>
  <div class="home">
    <div class="home-main">
      <!-- HERO SLIDER START -->
      <HomeHeroSlider :banners="banners.data" />
      <!-- HERO SLIDER END -->

      <GameList></GameList>

      <div class="challenges" v-if="displayedChallenges">
        <Challenge
          :challenge="challenge"
          :key="challenge._id"
          v-for="challenge of displayedChallenges"
        ></Challenge>
      </div>
    </div>
  </div>
</template>

<script>
import GameList from "@/components/GameList.vue";
import Challenge from "@/views/challenges/Challenge.vue";
import HomeHeroSlider from "@/components/HomeHeroSlider.vue";
import { mapGetters, mapActions } from "vuex";
import LoadingAnimation from "@/components/LoadingAnimation";
import RaceTimer from "@/components/RaceTimer.vue";
import AppButton from "@/components/AppButton.vue";
import RulesIcon from "@/assets/images/chat_rules.svg";
import { getUserLevel } from "@/utils";

export default {
  name: "Home",
  metaInfo: {
    title: "Growbit",
  },
  components: {
    GameList,
    Challenge,
    HomeHeroSlider,
    RaceTimer,
    AppButton,
  },
  computed: {
    ...mapGetters(["challengesData", "leaderboardData", "authUser", "banners"]),
    loggedIn() {
      return this.authUser.user;
    },

    levelInfo() {
      let info = getUserLevel(this.authUser?.user);
      return info;
    },
    displayedChallenges() {
      let list = this.challengesData?.active;

      if (!list) return null;

      function claims(c) {
        if (
          c.claimedBy.some(
            (u) => u.toString() === this?.authUser?.user?._id?.toString(),
          )
        ) {
          return 0;
        }

        return c.remainingClaims;
      }
      return list.sort((a, b) => claims(b) - claims(a)).slice(0, 2);
    },
  },
  data() {
    return {
      isMobile: false,
    };
  },
  methods: {
    ...mapActions([
      "leaderboardGetDataSocket",
      "modalsSetShow",
      "modalsSetData",
      "generalFetchBanners",
    ]),
    onResize() {
      this.isMobile = window.innerWidth <= 991;
    },
  },
  created() {
    window.addEventListener("resize", this.onResize);
    this.onResize();
    this.generalFetchBanners();
    if (this.leaderboardData.loading === false) {
      this.leaderboardGetDataSocket({});
    }
  },
};
</script>

<style scoped lang="scss">
@use "/src/assets/sass/mixins" as m;
.challenges {
  display: flex;
  width: 100%;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: flex-start;
}

.home {
  @media screen and (min-width: 991px) {
    padding: 25px 0 0 0;
  }
  padding-inline: 10px;

  width: 100%;
  overflow: hidden;
  max-width: 1100px;
  position: relative;
  margin-inline: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  .home-main {
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
}

@media only screen and (max-width: 1300px) {
  .home .home-main {
    padding: 10px 0 0 0;
  }
}
</style>
