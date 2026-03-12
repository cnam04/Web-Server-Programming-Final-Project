<script setup>
import { ref, computed } from 'vue'

const session = ref({
  title: '',
  date: new Date().toISOString().slice(0, 10),
  location: '',
  type: 'outdoor',
  duration: '',
  feeling: 3,
  notes: '',
})

const climbs = ref([])

const outdoorGrades = [
  '5.5', '5.6', '5.7', '5.8', '5.9',
  '5.10a', '5.10b', '5.10c', '5.10d',
  '5.11a', '5.11b', '5.11c', '5.11d',
  '5.12a', '5.12b', '5.12c', '5.12d',
  '5.13a', '5.13b', '5.13c', '5.13d',
  '5.14a', '5.14b', '5.14c', '5.14d',
]

const boulderGrades = [
  'V0', 'V1', 'V2', 'V3', 'V4', 'V5',
  'V6', 'V7', 'V8', 'V9', 'V10', 'V11', 'V12',
]

const indoorColors = [
  'Red', 'Blue', 'Green', 'Yellow', 'Orange',
  'Purple', 'Pink', 'White', 'Black',
]

const climbStyles = ['Rope', 'Boulder']

const attempts = ['Flash', 'Onsight', 'Redpoint', 'Fell/Hung', 'Project']

const isIndoor = computed(() => session.value.type === 'indoor')

function gradesForClimb(climb) {
  return climb.style === 'Boulder' ? boulderGrades : outdoorGrades
}

function onStyleChange(climb) {
  climb.grade = ''
}

function addClimb() {
  if (isIndoor.value) {
    climbs.value.push({
      color: '',
      grade: '',
      style: 'Top Rope',
      attempt: 'Redpoint',
      quality: 5,
      comment: '',
    })
  } else {
    climbs.value.push({
      name: '',
      grade: '',
      style: 'Lead',
      attempt: 'Redpoint',
      quality: 5,
      comment: '',
    })
  }
}

function removeClimb(index) {
  climbs.value.splice(index, 1)
}

function handleSubmit() {
  const payload = {
    ...session.value,
    climbs: climbs.value,
  }
  console.log('Submitting session:', payload)
  // TODO: send to API
}

const feelingLabels = ['Terrible', 'Bad', 'Okay', 'Good', 'Great']
</script>

<template>
  <form @submit.prevent="handleSubmit">
    <!-- Session Info -->

      <div class="field">
        <label class="label">Session Title</label>
        <div class="control">
          <input
            v-model="session.title"
            class="input"
            type="text"
            placeholder="e.g. Morning session at the crag"
            required
          />
        </div>
      </div>

      <div class="columns">
        <div class="column">
          <div class="field">
            <label class="label">Date</label>
            <div class="control">
              <input v-model="session.date" class="input" type="date" required />
            </div>
          </div>
        </div>
        <div class="column">
          <div class="field">
            <label class="label">Duration (minutes)</label>
            <div class="control">
              <input
                v-model.number="session.duration"
                class="input"
                type="number"
                min="0"
                placeholder="90"
              />
            </div>
          </div>
        </div>
      </div>

      <div class="columns">
        <div class="column">
          <div class="field">
            <label class="label">Location</label>
            <div class="control">
              <input
                v-model="session.location"
                class="input"
                type="text"
                :placeholder="isIndoor ? 'e.g. Movement Gym' : 'e.g. Red River Gorge'"
              />
            </div>
          </div>
        </div>
        <div class="column is-narrow">
          <div class="field">
            <label class="label">Type</label>
            <div class="control">
              <div class="buttons has-addons">
                <button
                  type="button"
                  class="button"
                  :class="{ 'is-info is-selected': !isIndoor }"
                  @click="session.type = 'outdoor'"
                >
                  Outdoor
                </button>
                <button
                  type="button"
                  class="button"
                  :class="{ 'is-info is-selected': isIndoor }"
                  @click="session.type = 'indoor'"
                >
                  Indoor
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="field">
        <label class="label">
          How did you feel? &mdash;
          <strong>{{ feelingLabels[session.feeling - 1] }}</strong>
        </label>
        <div class="control">
          <input
            v-model.number="session.feeling"
            type="range"
            min="1"
            max="5"
            step="1"
            class="slider is-fullwidth"
            style="width: 100%"
          />
        </div>
      </div>

      <div class="field">
        <label class="label">Session Notes</label>
        <div class="control">
          <textarea
            v-model="session.notes"
            class="textarea"
            placeholder="How did the session go? Anything to remember?"
            rows="2"
          ></textarea>
        </div>
      </div>

    <!-- Climbs -->
      <div class="level">
        <div class="level-left">
          <h3 class="title is-5 mb-0">Climbs</h3>
        </div>
        <div class="level-right">
          <button type="button" class="button is-success is-small" @click="addClimb">
            + Add Climb
          </button>
        </div>
      </div>

      <p v-if="climbs.length === 0" class="has-text-grey mt-3">
        No climbs added yet. Click <strong>+ Add Climb</strong> to log a route or problem.
      </p>

      <div
        v-for="(climb, i) in climbs"
        :key="i"
        class="notification is-dark mt-3"
      >
        <button type="button" class="delete" @click="removeClimb(i)"></button>
        <p class="has-text-weight-bold mb-2">Climb #{{ i + 1 }}</p>

        <div class="columns is-multiline">
          <!-- Outdoor: route name / Indoor: color -->
          <div class="column is-half" v-if="!isIndoor">
            <div class="field">
              <label class="label is-small">Route Name</label>
              <div class="control">
                <input
                  v-model="climb.name"
                  class="input is-small"
                  type="text"
                  placeholder="e.g. Midnight Lightning"
                />
              </div>
            </div>
          </div>
          <div class="column is-half" v-else>
            <div class="field">
              <label class="label is-small">Hold Color</label>
              <div class="control">
                <div class="select is-small is-fullwidth">
                  <select v-model="climb.color">
                    <option value="" disabled>Pick a color</option>
                    <option v-for="c in indoorColors" :key="c" :value="c">{{ c }}</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <!-- Grade -->
          <div class="column is-half">
            <div class="field">
              <label class="label is-small">
                Grade
                <span class="has-text-grey-light is-size-7">
                  ({{ climb.style === 'Boulder' ? 'V-scale' : 'YDS' }})
                </span>
              </label>
              <div class="control">
                <div class="select is-small is-fullwidth">
                  <select v-model="climb.grade">
                    <option value="" disabled>Select grade</option>
                    <option v-for="g in gradesForClimb(climb)" :key="g" :value="g">{{ g }}</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <!-- Style -->
          <div class="column is-half">
            <div class="field">
              <label class="label is-small">Style</label>
              <div class="control">
                <div class="select is-small is-fullwidth">
                  <select v-model="climb.style" @change="onStyleChange(climb)">
                    <option v-for="s in climbStyles" :key="s" :value="s">{{ s }}</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <!-- Attempt -->
          <div class="column is-half">
            <div class="field">
              <label class="label is-small">Attempt</label>
              <div class="control">
                <div class="select is-small is-fullwidth">
                  <select v-model="climb.attempt">
                    <option v-for="a in attempts" :key="a" :value="a">{{ a }}</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <!-- Quality -->
          <div class="column is-half">
            <div class="field">
              <label class="label is-small">Quality: {{ climb.quality }} / 10</label>
              <div class="control">
                <input
                  v-model.number="climb.quality"
                  type="range"
                  min="1"
                  max="10"
                  step="1"
                  style="width: 100%"
                />
              </div>
            </div>
          </div>

          <!-- Comment -->
          <div class="column is-full">
            <div class="field">
              <label class="label is-small">Comment</label>
              <div class="control">
                <input
                  v-model="climb.comment"
                  class="input is-small"
                  type="text"
                  placeholder="Beta notes, conditions, etc."
                />
              </div>
            </div>
          </div>
        </div>
      </div>

    <!-- Submit -->
    <div class="field is-grouped">
      <div class="control">
        <button type="submit" class="button is-link">Save Session</button>
      </div>
      <div class="control">
        <button type="button" class="button is-light">Cancel</button>
      </div>
    </div>
  </form>
</template>