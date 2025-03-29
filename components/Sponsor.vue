<template>
  <div class="sponsor">
    <svg
      width="220"
      viewBox="0 0 512 512"
      xmlns="http://www.w3.org/2000/svg"
      fill="currentColor"
      stroke="currentColor"
    >
      <g clip-path="url(#clip0_205_3)">
        <path
          d="M3 248.945C18 248.945 76 236 106 219C136 202 136 202 198 158C276.497 102.293 332 120.945 423 120.945"
          stroke-width="90"
        />
        <path d="M511 121.5L357.25 210.268L357.25 32.7324L511 121.5Z" />
        <path
          d="M0 249C15 249 73 261.945 103 278.945C133 295.945 133 295.945 195 339.945C273.497 395.652 329 377 420 377"
          stroke-width="90"
        />
        <path d="M508 376.445L354.25 287.678L354.25 465.213L508 376.445Z" />
      </g>
    </svg>

    <div>
      <p>
        <b>Big thanks to <a href="https://openrouter.ai/">OpenRouter</a> for sponsoring Universal!</b> Their support
        gives you (and many more people) the opportunity to "see the future today".
      </p>
      <p>
        If I hadn't originally built Universal on OpenRouter, I suspect I would have given up after the first
        7 models I tried failed: "neat idea, but oh well, doesn't work". Instead swapping models was easy,
        so I kept going and eventually discovered the only contemporary model that <i>could</i> handle this task.
      </p>
    </div>
  </div>
</template>

<style scoped>
#auth-popover h1 {
  margin-top: 0;
}

.sponsor {
  background-color: #0070f3;
  color: white;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 20px;
  border-radius: 20px;
}


.sponsor a {
  color: white;
  text-decoration: none;
}

</style>