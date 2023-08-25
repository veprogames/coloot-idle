<script lang="ts">
  import Player from "./lib/player/Player.svelte";
  import { game } from "./lib/stores";
</script>

<main>
  <Player player={$game.player} />
</main>
