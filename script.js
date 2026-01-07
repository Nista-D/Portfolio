// Wait for the DOM to be fully loaded
document.addEventListener("DOMContentLoaded", () => {
  // Font animation for the name
  const animatedName = document.getElementById("animatedName")
  const fonts = ["'Orbitron', sans-serif", "'Rajdhani', sans-serif", "'Syncopate', sans-serif", "'Inter', sans-serif", "Typewriter", "Cursive"]
  let currentFontIndex = 0

  function changeFont() {
    if (animatedName) {
      animatedName.style.fontFamily = fonts[currentFontIndex]
      currentFontIndex = (currentFontIndex + 1) % fonts.length
    }
  }

  // Change font every 2 seconds
  setInterval(changeFont, 2000)

  // Mockups Carousel
  const mockups = document.querySelectorAll(".mockup")
  let currentMockupIndex = 0

  if (mockups.length > 0) {
    // Set first mockup as active
    mockups[0].classList.add("active")

    function rotateMockups() {
      // Hide current mockup
      mockups[currentMockupIndex].classList.remove("active")

      // Update index
      currentMockupIndex = (currentMockupIndex + 1) % mockups.length

      // Show next mockup
      mockups[currentMockupIndex].classList.add("active")
    }

    // Auto-rotate mockups every 3 seconds
    setInterval(rotateMockups, 3000)
  }

  // Projects auto-scroll functionality with manual override
  const projectsCarousel = document.querySelector(".projects-carousel")
  const projectsWrapper = document.querySelector(".projects-wrapper")

  // Clone projects for infinite scroll
  function setupInfiniteScroll() {
    const projects = document.querySelectorAll(".project")

    if (projects.length > 0 && projectsWrapper) {
      // Clone each project and append to wrapper
      projects.forEach((project) => {
        const clone = project.cloneNode(true)
        projectsWrapper.appendChild(clone)
      })
    }
  }

  // Setup infinite scroll
  setupInfiniteScroll()

  // Manual scrolling capability
  if (projectsCarousel) {
    let isScrolling = false
    let startY = 0
    let scrollTop = 0

    projectsCarousel.addEventListener("mousedown", (e) => {
      isScrolling = true
      startY = e.pageY - projectsCarousel.offsetTop
      scrollTop = projectsCarousel.scrollTop
      if (projectsWrapper) {
        projectsWrapper.style.animationPlayState = "paused"
      }
    })

    document.addEventListener("mousemove", (e) => {
      if (!isScrolling) return
      e.preventDefault()
      const y = e.pageY - projectsCarousel.offsetTop
      const walk = (y - startY) * 2
      projectsCarousel.scrollTop = scrollTop - walk
    })

    document.addEventListener("mouseup", () => {
      isScrolling = false
      if (projectsWrapper) {
        projectsWrapper.style.animationPlayState = "running"
      }
    })

    // Touch events for mobile
    projectsCarousel.addEventListener("touchstart", (e) => {
      isScrolling = true
      startY = e.touches[0].pageY - projectsCarousel.offsetTop
      scrollTop = projectsCarousel.scrollTop
      if (projectsWrapper) {
        projectsWrapper.style.animationPlayState = "paused"
      }
    })

    document.addEventListener("touchmove", (e) => {
      if (!isScrolling) return
      const y = e.touches[0].pageY - projectsCarousel.offsetTop
      const walk = (y - startY) * 2
      projectsCarousel.scrollTop = scrollTop - walk
    })

    document.addEventListener("touchend", () => {
      isScrolling = false
      if (projectsWrapper) {
        projectsWrapper.style.animationPlayState = "running"
      }
    })

    // Pause animation on hover
    projectsCarousel.addEventListener("mouseenter", () => {
      if (projectsWrapper) {
        projectsWrapper.style.animationPlayState = "paused"
      }
    })

    projectsCarousel.addEventListener("mouseleave", () => {
      if (projectsWrapper) {
        projectsWrapper.style.animationPlayState = "running"
      }
    })
  }

  // Copy email functionality
  const copyEmailBtn = document.querySelector(".copy-email")
  const emailDisplay = document.querySelector(".email-display")

  if (copyEmailBtn && emailDisplay) {
    copyEmailBtn.addEventListener("click", () => {
      const email = emailDisplay.textContent
      navigator.clipboard.writeText(email).then(() => {
        // Change button text temporarily
        const originalText = copyEmailBtn.innerHTML
        copyEmailBtn.innerHTML = '<i class="fas fa-check"></i> Copied!'

        setTimeout(() => {
          copyEmailBtn.innerHTML = originalText
        }, 2000)
      }).catch(() => {
        // Fallback for older browsers
        const textArea = document.createElement('textarea')
        textArea.value = email
        document.body.appendChild(textArea)
        textArea.select()
        document.execCommand('copy')
        document.body.removeChild(textArea)
        
        const originalText = copyEmailBtn.innerHTML
        copyEmailBtn.innerHTML = '<i class="fas fa-check"></i> Copied!'
        setTimeout(() => {
          copyEmailBtn.innerHTML = originalText
        }, 2000)
      })
    })
  }

  // Add hover effect to project images
  const projectItems = document.querySelectorAll(".project")

  projectItems.forEach((item) => {
    item.addEventListener("mouseenter", function () {
      const img = this.querySelector("img")
      if (img) {
        img.style.transform = "scale(1.05)"
      }
    })

    item.addEventListener("mouseleave", function () {
      const img = this.querySelector("img")
      if (img) {
        img.style.transform = "scale(1)"
      }
    })
  })

  // Add animation class for CSS transitions
  document.querySelectorAll(".bento-item, .name-section").forEach((item, index) => {
    item.style.opacity = "0"
    item.style.transform = "translateY(20px)"
    item.style.transition = "opacity 0.5s ease, transform 0.5s ease"

    setTimeout(() => {
      item.style.opacity = "1"
      item.style.transform = "translateY(0)"
    }, index * 100)
  })

  // Resume download functionality
  // const downloadResumeBtn = document.getElementById("downloadResume")

  // if (downloadResumeBtn) {
  //   downloadResumeBtn.addEventListener("click", (e) => {
  //     e.preventDefault()
  //     // Create a fake download (in a real scenario, this would link to an actual file)
  //     const link = document.createElement("a")
  //     link.href = "#" // In a real scenario, this would be the path to the resume file
  //     link.download = "nista_dangol_resume.pdf"

  //     // Show download notification
  //     alert("Resume download would start in a real scenario.")

  //     // In a real scenario, you would trigger the download
  //     // document.body.appendChild(link)
  //     // link.click()
  //     // document.body.removeChild(link)
  //   })
  // }


    // Resume view functionality
  const viewResumeBtn = document.getElementById("downloadResume");

  if (viewResumeBtn) {
    viewResumeBtn.addEventListener("click", (e) => {
      e.preventDefault();
      window.open("assets/NistaDangol_Resume.pdf", "_blank"); // Update to your actual resume path
    });
  }


  // Expandable sections functionality
  const expandAboutBtn = document.getElementById("expandAbout")
  const expandProjectsBtn = document.getElementById("expandProjects")
  const expandedOverlay = document.getElementById("expandedOverlay")
  const expandedContent = document.getElementById("expandedContent")
  const expandedTitle = document.getElementById("expandedTitle")
  const expandedBody = document.getElementById("expandedBody")
  const closeExpandedBtn = document.getElementById("closeExpanded")

  console.log("Close button element:", closeExpandedBtn)

  // Function to open expanded section
  function openExpandedSection(title, content) {
    if (expandedTitle) expandedTitle.textContent = title
    if (expandedBody) expandedBody.innerHTML = content
    if (expandedOverlay) expandedOverlay.classList.add("active")
    document.body.style.overflow = "hidden"
  }

  // Function to close expanded section
  function closeExpandedSection() {
    console.log("Closing expanded section...")
    if (expandedOverlay) {
      expandedOverlay.classList.remove("active")
    }
    document.body.style.overflow = ""
  }

  // About section expand
  if (expandAboutBtn) {
    expandAboutBtn.addEventListener("click", () => {
      const aboutContent = `
        <div class="expanded-about" >
          I love creating interfaces that look beautiful but also make sense to real humans (shocking concept, I know). My internship was... a learning experience, let's say, but it taught me I'm pretty good at figuring things out when left to my own devices.
          I'm hoping to find a team where I can contribute some fresh perspective while learning from designers who've been around the block a few times. Because honestly, the best ideas usually come from bouncing thoughts off people who know more than you do. <br><br>
          I'm inquisitive, a bit of a perfectionist (just a bit), and someone who genuinely cares about solving real problems through thoughtful design. While I may be early in my career, I bring fresh perspective, eagerness to learn, and the kind of dedication that turns challenges into growth opportunities. <br><br>
          Let's meet in person!
          <br>

          <a 
            href="assets/Nista_Dangol_Resume.pdf"
            class="resume-link"
            target="_blank"
            rel="noopener"
            style="display: inline-flex; margin-top: 20px;"
          >
            <i class="fa-solid fa-eye"></i> View Full Resume
          </a>

        </div>
      `
      openExpandedSection("ABOUT ME", aboutContent)
    })
  }

  // Projects section expand
  if (expandProjectsBtn) {
    expandProjectsBtn.addEventListener("click", () => {
      const projectsContent = `
        <div class="expanded-projects">
          <div class="project-grid">
            <div class="project-card">
              <img src="/placeholder.svg?height=200&width=350" alt="Mobile App Design">
              <div class="project-card-info">
                <h3>Neon UI Mobile App</h3>
                <p>A futuristic mobile application with neon aesthetics designed for a tech startup. The app features a unique navigation system and custom animations.</p>
                <div class="project-tags">
                  <span>UI Design</span>
                  <span>Mobile</span>
                  <span>Figma</span>
                </div>
              </div>
            </div>
            
            <div class="project-card">
              <img src="/placeholder.svg?height=200&width=350" alt="Dashboard Design">
              <div class="project-card-info">
                <h3>Cyberpunk Dashboard</h3>
                <p>Data visualization dashboard with a cyberpunk theme. This project focused on presenting complex data in an intuitive and visually engaging way.</p>
                <div class="project-tags">
                  <span>Dashboard</span>
                  <span>Data Viz</span>
                  <span>Adobe XD</span>
                </div>
              </div>
            </div>
            
            <div class="project-card">
              <img src="/placeholder.svg?height=200&width=350" alt="Website Design">
              <div class="project-card-info">
                <h3>Tech Startup Website</h3>
                <p>Modern website design for a tech company featuring glass morphism and subtle animations. The site includes a custom CMS and responsive design.</p>
                <div class="project-tags">
                  <span>Web Design</span>
                  <span>Responsive</span>
                  <span>Figma</span>
                </div>
              </div>
            </div>
            
            <div class="project-card">
              <img src="/placeholder.svg?height=200&width=350" alt="E-commerce App">
              <div class="project-card-info">
                <h3>Futuristic E-commerce</h3>
                <p>Shopping experience with a sci-fi interface. This project reimagines the online shopping experience with immersive product visualization.</p>
                <div class="project-tags">
                  <span>E-commerce</span>
                  <span>UX Design</span>
                  <span>Sketch</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <style>
          .project-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
            gap: 20px;
          }
          
          .project-card {
            background: rgba(255, 255, 255, 0.05);
            border-radius: 12px;
            overflow: hidden;
            transition: transform 0.3s ease;
          }
          
          .project-card:hover {
            transform: translateY(-5px);
          }
          
          .project-card img {
            width: 100%;
            height: 200px;
            object-fit: cover;
          }
          
          .project-card-info {
            padding: 15px;
          }
          
          .project-card-info h3 {
            margin-bottom: 10px;
          }
          
          .project-card-info p {
            color: var(--text-secondary);
            margin-bottom: 15px;
          }
          
          .project-tags {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
          }
          
          .project-tags span {
            background: rgba(255, 255, 255, 0.1);
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 0.8rem;
          }
        </style>
      `
      openExpandedSection("MY PROJECTS", projectsContent)
    })
  }

  // Close expanded section - Multiple event listeners for reliability
  if (closeExpandedBtn) {
    closeExpandedBtn.addEventListener("click", (e) => {
      console.log("Close button clicked!")
      e.preventDefault()
      e.stopPropagation()
      closeExpandedSection()
    })
  }

  // Close when clicking outside the content
  if (expandedOverlay) {
    expandedOverlay.addEventListener("click", (e) => {
      if (e.target === expandedOverlay) {
        closeExpandedSection()
      }
    })
  }

  // Close with Escape key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeExpandedSection()
    }
  })

  // Additional close button setup (fallback)
  setTimeout(() => {
    const closeBtn = document.querySelector(".close-btn")
    if (closeBtn) {
      console.log("Setting up fallback close button")
      closeBtn.onclick = function(e) {
        console.log("Fallback close clicked")
        e.preventDefault()
        closeExpandedSection()
        return false
      }
    }
  }, 100)
})
