document.addEventListener('DOMContentLoaded', function() {
            const navItems = document.querySelectorAll('#navList li');
            const sections = document.querySelectorAll('.page-section');
            let currentActiveItem = null;

            // Function to add completed state (strikethrough + scribbled checkbox)
            function addCompletedState(navItem) {
                navItem.classList.add('active');
            }

            // Function to remove completed state
            function removeCompletedState(navItem) {
                navItem.classList.remove('active')
            }

            // Function to reset all nav items
            function resetAllNavItems() {
                navItems.forEach(item => {
                    removeCompletedState(item);
                });
                currentActiveItem = null;
            }

            // Function to get current section in viewport
            function getCurrentSection() {
                let current = null;
                const scrollPosition = window.scrollY;

               const sortedSections = Array.from(sections).sort((a, b) => a.offsetTop - b.offsetTop);

                for (let i = 0; i < sortedSections.length; i++) {
                    const section = sortedSections[i];
                    const sectionTop = section.offsetTop;
                    
                    // Determine section bottom
                    let sectionBottom;
                    if (i < sortedSections.length - 1) {
                        sectionBottom = sortedSections[i + 1].offsetTop;
                    } else {
                        sectionBottom = document.body.scrollHeight;
                    }
                    
                    // Check if we're in this section (with some tolerance)
                    if (scrollPosition >= sectionTop - 50 && scrollPosition < sectionBottom - 50) {
                        current = section;
                        break; // Take the first match to avoid overlaps
                    }
                }

                return current;
            }

            // Function to handle section changes
            function handleSectionChange() {
                // Reset all if at very top of page
                if (window.scrollY == 0) {
                    resetAllNavItems();
                    return;
                }

                const currentSection = getCurrentSection();
                
                if (currentSection) {
                    const sectionId = currentSection.id;
                    const targetNavItem = document.querySelector(`[data-target="${sectionId}"]`);
                    
                    if (targetNavItem && targetNavItem !== currentActiveItem) {
                        // Reset previous active item
                        if (currentActiveItem) {
                            removeCompletedState(currentActiveItem);
                        }
                        
                        // Set new active item
                        addCompletedState(targetNavItem);
                        currentActiveItem = targetNavItem;
                    }
                }
            }

            // Click handler for nav items (assuming you want to keep this functionality)
            navItems.forEach(item => {
                item.addEventListener('click', function(e) {
                    const anchor = this.querySelector('a[href]');

                    if (anchor) {
                        return; // Lets the browser handle the native link
                    }

                    e.preventDefault(); // Only prevent default if it's an in-page scroll
                    
                    // Reset all items first
                    resetAllNavItems();
                    
                    // Add completed state to clicked item
                    addCompletedState(this);
                    currentActiveItem = this;
                    
                    // Scroll to target section
                    const targetId = this.getAttribute('data-target');
                    const targetSection = document.getElementById(targetId);
                    
                    if (targetSection) {
                        targetSection.scrollIntoView({
                            behavior: 'smooth',
                            block: 'start'
                        });
                    }
                });
            });

            // Scroll event listener with throttling for better performance
            let scrollTimeout;
            window.addEventListener('scroll', function() {
                if (scrollTimeout) {
                    clearTimeout(scrollTimeout);
                }
                
                scrollTimeout = setTimeout(handleSectionChange, 10);
            });

            // Initial check on page load
            handleSectionChange();
        });