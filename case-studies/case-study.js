let index = 0
const slides = document.querySelector(".slides")
const totalSlides = document.querySelectorAll(".slide").length
const indicators = document.querySelectorAll(".indicator")
let autoSlideInterval
let isDraggingAnyHandle = false
let carouselLocked = false

function updateCarousel(instant = false) {
  if (carouselLocked) return

  if (instant) {
    slides.classList.add("loading")
  } else {
    slides.classList.remove("loading")
  }

  slides.style.transform = `translate3d(-${index * 100}%, 0, 0)`

  indicators.forEach((indicator, i) => {
    setTimeout(() => {
      indicator.classList.toggle("active", i === index)
    }, i * 50)
  })

  if (instant) {
    setTimeout(() => {
      slides.classList.remove("loading")
    }, 50)
  }
}

function nextSlide() {
  if (carouselLocked) return
  index = (index + 1) % totalSlides
  updateCarousel()
}

function prevSlide() {
  if (carouselLocked) return
  index = (index - 1 + totalSlides) % totalSlides
  updateCarousel()
}

function goToSlide(slideIndex) {
  if (carouselLocked) return
  index = slideIndex
  updateCarousel()
}

function startAutoSlide() {
  if (!isDraggingAnyHandle && !carouselLocked) {
    autoSlideInterval = setInterval(() => {
      if (!carouselLocked) {
        nextSlide()
      }
    }, 6000)
  }
}

function stopAutoSlide() {
  clearInterval(autoSlideInterval)
}

// Event listeners
document.getElementById("next").addEventListener("click", (e) => {
  if (carouselLocked) {
    e.preventDefault()
    return
  }
  nextSlide()
  stopAutoSlide()
  setTimeout(startAutoSlide, 1000)
})

document.getElementById("prev").addEventListener("click", (e) => {
  if (carouselLocked) {
    e.preventDefault()
    return
  }
  prevSlide()
  stopAutoSlide()
  setTimeout(startAutoSlide, 1000)
})

indicators.forEach((indicator, i) => {
  indicator.addEventListener("click", (e) => {
    if (carouselLocked) {
      e.preventDefault()
      return
    }
    goToSlide(i)
    stopAutoSlide()
    setTimeout(startAutoSlide, 1000)
  })
})

document.addEventListener("keydown", (e) => {
  if (carouselLocked) return

  if (e.key === "ArrowRight") {
    nextSlide()
    stopAutoSlide()
    setTimeout(startAutoSlide, 1000)
  } else if (e.key === "ArrowLeft") {
    prevSlide()
    stopAutoSlide()
    setTimeout(startAutoSlide, 1000)
  }
})

document.querySelector(".carousel-wrapper").addEventListener("mouseenter", () => {
  if (!isDraggingAnyHandle && !carouselLocked) {
    stopAutoSlide()
  }
})

document.querySelector(".carousel-wrapper").addEventListener("mouseleave", () => {
  if (!isDraggingAnyHandle && !carouselLocked) {
    setTimeout(startAutoSlide, 500)
  }
})

// Comparison slider functionality
document.querySelectorAll(".comparison-container").forEach((container) => {
  const before = container.querySelector(".comparison-before")
  const handle = container.querySelector(".handle")

  let isLocalDragging = false
  let animationFrame

  const startDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()

    isLocalDragging = true
    isDraggingAnyHandle = true
    carouselLocked = true

    document.body.classList.add("dragging")

    handle.style.transition = "none"
    before.style.transition = "none"

    stopAutoSlide()
    moveSlider(e)
  }

  const endDrag = (e) => {
    if (!isLocalDragging) return

    e.preventDefault()
    e.stopPropagation()

    isLocalDragging = false
    isDraggingAnyHandle = false

    document.body.classList.remove("dragging")

    handle.style.transition = "left 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)"
    before.style.transition = "width 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)"

    setTimeout(() => {
      carouselLocked = false
      if (!isDraggingAnyHandle) {
        setTimeout(startAutoSlide, 800)
      }
    }, 200)
  }

  const moveSlider = (e) => {
    if (!isLocalDragging) return

    e.preventDefault()
    e.stopPropagation()

    if (animationFrame) {
      cancelAnimationFrame(animationFrame)
    }

    animationFrame = requestAnimationFrame(() => {
      const currentX = e.touches ? e.touches[0].clientX : e.clientX
      const rect = container.getBoundingClientRect()
      let x = currentX - rect.left
      x = Math.max(0, Math.min(x, container.offsetWidth))

      const percentage = (x / container.offsetWidth) * 100

      before.style.width = `${percentage}%`
      handle.style.left = `${percentage}%`
    })
  }

  handle.addEventListener("mousedown", startDrag)
  document.addEventListener("mousemove", moveSlider)
  document.addEventListener("mouseup", endDrag)

  handle.addEventListener("touchstart", startDrag, { passive: false })
  document.addEventListener("touchmove", moveSlider, { passive: false })
  document.addEventListener("touchend", endDrag)

  handle.addEventListener("keydown", (e) => {
    if (carouselLocked && !isLocalDragging) return

    const currentPercentage = Number.parseFloat(handle.style.left) || 50
    let newPercentage = currentPercentage

    if (e.key === "ArrowLeft") {
      newPercentage = Math.max(0, currentPercentage - 3)
      e.preventDefault()
      e.stopPropagation()
    } else if (e.key === "ArrowRight") {
      newPercentage = Math.min(100, currentPercentage + 3)
      e.preventDefault()
      e.stopPropagation()
    }

    if (newPercentage !== currentPercentage) {
      before.style.transition = "width 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94)"
      handle.style.transition = "left 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94)"

      before.style.width = `${newPercentage}%`
      handle.style.left = `${newPercentage}%`

      setTimeout(() => {
        before.style.transition = "width 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)"
        handle.style.transition = "left 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)"
      }, 200)
    }
  })
})

// Initialize
updateCarousel(true)
setTimeout(startAutoSlide, 1000)
