

document.addEventListener('DOMContentLoaded', function() {
    const navItems = document.querySelectorAll('#navList li, #mobileNavList li');
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
            const desktopNavItem = document.querySelector(`#navList li[data-target="${sectionId}"]`);
            const mobileNavItem = document.querySelector(`#mobileNavList li[data-target="${sectionId}"]`);
            
            if (desktopNavItem && desktopNavItem !== currentActiveItem) {
                // Reset previous active item
                if (currentActiveItem) {
                    removeCompletedState(currentActiveItem);

                    const correspondingItem = currentActiveItem.closest('#navList') ?
                        document.querySelector(`#mobileNavList li[data-target="${currentActiveItem.getAttribute('data-target')}"]`) :
                        document.querySelector(`#navList li[data-target="${currentActiveItem.getAttribute('data-target')}"]`);

                    if (correspondingItem) {
                        removeCompletedState(correspondingItem);
                    }
                }
                
                // Set new active item
                addCompletedState(desktopNavItem)
                if (mobileNavItem) {
                    addCompletedState(mobileNavItem);
                }
                currentActiveItem = desktopNavItem;
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


    // Hamburger Menu Functionality
    const hamburger = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobileMenu');
    const closeBtn = document.getElementById('closeBtn');
    const mobileNavItems = document.querySelectorAll('#mobileNavList li');

    // Open mobile menu
    hamburger.addEventListener('click', function() {
        hamburger.classList.toggle('active');
        mobileMenu.classList.toggle('active');
        document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : 'auto';
    });

    // Close mobile menu
    closeBtn.addEventListener('click', function() {
        hamburger.classList.remove('active');
        mobileMenu.classList.remove('active');
        document.body.style.overflow = 'auto';
    });

    // Close menu when clicking outside
    mobileMenu.addEventListener('click', function(e) {
        if (e.target === mobileMenu) {
            hamburger.classList.remove('active');
            mobileMenu.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    });

    // Add mobile nav items to the existing navigation logic
    mobileNavItems.forEach(item => {
        item.addEventListener('click', function(e) {
            const anchor = this.querySelector('a[href]');

            if (anchor) {
                // Close mobile menu for external links
                hamburger.classList.remove('active');
                mobileMenu.classList.remove('active');
                document.body.style.overflow = 'auto';
                return; // Let the browser handle the native link
            }

            e.preventDefault(); // Only prevent default if it's an in-page scroll
            
            // Close mobile menu
            hamburger.classList.remove('active');
            mobileMenu.classList.remove('active');
            document.body.style.overflow = 'auto';
            
            // Reset all items first (both desktop and mobile)
            const allNavItems = document.querySelectorAll('#navList li, #mobileNavList li');
            allNavItems.forEach(navItem => {
                navItem.classList.remove('active');
            });
            
            // Add completed state to clicked item and corresponding desktop item
            const targetId = this.getAttribute('data-target');
            const desktopItem = document.querySelector(`#navList li[data-target="${targetId}"]`);
            
            this.classList.add('active');
            if (desktopItem) {
                desktopItem.classList.add('active');
            }
            currentActiveItem = desktopItem || this;
            
            // Scroll to target section
            const targetSection = document.getElementById(targetId);
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

});