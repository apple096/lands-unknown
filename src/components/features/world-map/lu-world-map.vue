<template>
  <igt-feature>
    <div class="flex flex-row">
      <div id="canvas-stack" class="w-full relative"
           :style="'height:' + stackHeight + 'px;'">
        <canvas id="world-canvas" class="pixelated absolute z-10"
                :class="{'cursor-pointer': showPointer}"></canvas>
        <canvas id="player-canvas" class="pixelated absolute z-20"
                :class="{'cursor-pointer': showPointer}"></canvas>
      </div>

      <lu-action-queue class="flex-init" :adventurer="adventurer"></lu-action-queue>
    </div>
  </igt-feature>
</template>

<script>
import {App} from "@/App.ts"

import IgtFeature from "@/components/util/igt-feature";
import {TiledWrapper} from "@/ig-template/tools/tiled/TiledWrapper";
import worldMap from '@/assets/tiled/maps/overworld.json'
import Panzoom from '@panzoom/panzoom'
import {TownLocationIdentifier} from "@/ig-template/features/world-map/towns/TownLocationIdentifier";
import {TravelAction} from "@/ig-template/features/world-map/TravelAction";
import LuActionQueue from "@/components/features/adventurer/lu-action-queue";

export default {
  name: "lu-world-map",
  components: {LuActionQueue, IgtFeature},

  data() {
    return {
      worldMap: App.game.features.worldMap,
      adventurer: App.game.features.adventurer,
      tiledWrapper: null,
      currentStep: 0,
      worldPanZoom: null,
      playerPanZoom: null,
      stackHeight: this.updateStackHeight(),
    }
  },
  computed: {
    playerPosition() {
      if (this.firstActionIsTravel) {
        return this.adventurer.actionQueue[0].getWorldPosition()
      }
      return {x: 0, y: 0};
    },
    firstActionIsTravel() {
      if (this.adventurer.actionQueue.length === 0) {
        return false;
      }
      return this.adventurer.actionQueue[0] instanceof TravelAction;
    },
    currentLocation() {
      return this.worldMap.playerLocation;
    },
    showPointer() {
      return this.tiledWrapper && this.tiledWrapper.isHoveringOverClickBox;
    }
  },
  methods: {
    updateStackHeight() {
      this.stackHeight = window.innerHeight - 200;
    }
  },
  watch: {
    playerPosition(newPosition) {
      // TODO refresh less often
      if (newPosition.x === 0 && newPosition.y === 0) {
        return;
      }
      const roads = this.worldMap.roads
      const queue = this.adventurer.actionQueue;
      const isPlanned = this.worldMap.roads.map(road => {
        const action = queue.find(action => {
          if (action instanceof TravelAction) {
            if (action.road.identifier.equals(road.identifier)) {
              return true;
            }
          }
          return false
        })
        return action != null;

      })
      this.tiledWrapper.renderPlayer(newPosition.x, newPosition.y, roads, isPlanned);
    }

  },
  mounted() {
    window.onresize = () => {
      this.updateStackHeight();
    }
    this.updateStackHeight();

    const worldCanvas = document.getElementById('world-canvas');
    const playerCanvas = document.getElementById('player-canvas');

    if (!worldCanvas || !playerCanvas) {
      console.warn("Could not load canvases");
      return;
    }

    this.tiledWrapper = new TiledWrapper(
        worldMap,
        worldCanvas,
        playerCanvas,
        () => {
          this.tiledWrapper.render();
          this.tiledWrapper.renderPlayer(-1, -1, this.worldMap.roads, new Array(this.worldMap.roads.length).fill(false));
        },
        (clickBox) => {
          const townId = clickBox.properties[0].value;
          this.worldMap.moveToLocation(new TownLocationIdentifier(townId));
        }
    )

    const panZoomOptions = {
      disableZoom: false,
      minScale: 0.8,
      maxScale: 5,
      contain: 'outside',
      canvas: true,
    };
    this.worldPanZoom = Panzoom(this.tiledWrapper.canvas, panZoomOptions)
    this.playerPanZoom = Panzoom(this.tiledWrapper.playerCanvas, panZoomOptions)
    this.tiledWrapper.canvas.parentElement.addEventListener('wheel', this.worldPanZoom.zoomWithWheel)
    this.tiledWrapper.canvas.parentElement.addEventListener('wheel', () => {
      this.tiledWrapper.currentScale = this.worldPanZoom.getScale();
    })
    this.tiledWrapper.playerCanvas.parentElement.addEventListener('wheel', this.playerPanZoom.zoomWithWheel)

    this.worldPanZoom.zoom(1);

  }
}
</script>

<style scoped>
.pixelated {
  image-rendering: -moz-crisp-edges;
  image-rendering: pixelated;
  -ms-interpolation-mode: nearest-neighbor;
}


</style>