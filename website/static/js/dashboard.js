/*
Professional Portfolio Dashboard JavaScript
Modern, interactive dashboard functionality
Version: 1.0.0
*/

class DashboardJS {
    constructor() {
        this.sidebar = null;
        this.mainContent = null;
        this.mobileMenuToggle = null;
        this.toastContainer = null;
        
        // Bind methods
        this.init = this.init.bind(this);
        this.toggleSidebar = this.toggleSidebar.bind(this);
        this.handleResize = this.handleResize.bind(this);
        this.showToast = this.showToast.bind(this);
        this.hideToast = this.hideToast.bind(this);
        this.handleBulkAction = this.handleBulkAction.bind(this);
        this.toggleItemSelection = this.toggleItemSelection.bind(this);
        this.selectAllItems = this.selectAllItems.bind(this);
    }

    init() {
        this.initializeElements();
        this.bindEvents();
        this.initializeComponents();
        console.log('Dashboard initialized');
    }

    initializeElements() {
        this.sidebar = document.getElementById('sidebar');
        this.mainContent = document.getElementById('main-content');
        this.mobileMenuToggle = document.getElementById('mobile-menu-toggle');
        this.toastContainer = document.getElementById('toast-container');
    }

    bindEvents() {
        // Mobile menu toggle
        if (this.mobileMenuToggle) {
            this.mobileMenuToggle.addEventListener('click', this.toggleSidebar);
        }

        // Window resize handler
        window.addEventListener('resize', this.handleResize);

        // Close sidebar when clicking outside on mobile
        document.addEventListener('click', (e) => {
            if (window.innerWidth <= 1024) {
                if (!this.sidebar.contains(e.target) && !this.mobileMenuToggle.contains(e.target)) {
                    this.closeSidebar();
                }
            }
        });

        // Bulk action handlers
        this.initializeBulkActions();
        
        // Form submission handlers
        this.initializeFormHandlers();
        
        // Modal handlers
        this.initializeModalHandlers();
        
        // Search and filter handlers
        this.initializeSearchFilters();
    }

    initializeComponents() {
        this.initializeDragDrop();
        this.initializeTooltips();
        this.initializeCharts();
    }

    // Sidebar Management
    toggleSidebar() {
        if (window.innerWidth <= 1024) {
            this.sidebar.classList.toggle('mobile-open');
        } else {
            this.sidebar.classList.toggle('collapsed');
            this.mainContent.classList.toggle('sidebar-collapsed');
        }
    }

    closeSidebar() {
        if (window.innerWidth <= 1024) {
            this.sidebar.classList.remove('mobile-open');
        }
    }

    handleResize() {
        if (window.innerWidth > 1024) {
            this.sidebar.classList.remove('mobile-open');
        } else {
            this.sidebar.classList.remove('collapsed');
            this.mainContent.classList.remove('sidebar-collapsed');
        }
    }

    // Toast Notifications
    showToast(message, type = 'info', duration = 5000) {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        
        toast.innerHTML = `
            <div class="flex items-start gap-3">
                <div class="flex-shrink-0">
                    ${this.getToastIcon(type)}
                </div>
                <div class="flex-1">
                    <p class="text-sm font-medium text-primary">${message}</p>
                </div>
                <button class="flex-shrink-0 text-secondary hover:text-primary" onclick="Dashboard.hideToast(this)">
                    <i data-feather="x" class="w-4 h-4"></i>
                </button>
            </div>
        `;

        this.toastContainer.appendChild(toast);
        
        // Trigger animation
        setTimeout(() => {
            toast.classList.add('show');
            feather.replace();
        }, 100);

        // Auto-hide
        if (duration > 0) {
            setTimeout(() => {
                this.hideToast(toast);
            }, duration);
        }

        return toast;
    }

    hideToast(toast) {
        if (typeof toast === 'object' && toast.closest) {
            toast = toast.closest('.toast');
        }
        
        toast.classList.remove('show');
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 300);
    }

    getToastIcon(type) {
        const icons = {
            success: '<i data-feather="check-circle" class="w-5 h-5 text-success"></i>',
            error: '<i data-feather="alert-circle" class="w-5 h-5 text-danger"></i>',
            warning: '<i data-feather="alert-triangle" class="w-5 h-5 text-warning"></i>',
            info: '<i data-feather="info" class="w-5 h-5 text-info"></i>'
        };
        return icons[type] || icons.info;
    }

    // Bulk Actions
    initializeBulkActions() {
        const bulkForms = document.querySelectorAll('[data-bulk-form]');
        bulkForms.forEach(form => {
            const selectAllCheckbox = form.querySelector('[data-select-all]');
            const itemCheckboxes = form.querySelectorAll('[data-bulk-item]');
            const bulkActionSelect = form.querySelector('[data-bulk-action]');
            const bulkSubmitBtn = form.querySelector('[data-bulk-submit]');

            if (selectAllCheckbox) {
                selectAllCheckbox.addEventListener('change', (e) => {
                    this.selectAllItems(e.target.checked, itemCheckboxes);
                });
            }

            itemCheckboxes.forEach(checkbox => {
                checkbox.addEventListener('change', () => {
                    this.updateBulkActionState(form);
                });
            });

            if (bulkSubmitBtn) {
                bulkSubmitBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.handleBulkAction(form);
                });
            }
        });
    }

    selectAllItems(checked, checkboxes) {
        checkboxes.forEach(checkbox => {
            checkbox.checked = checked;
        });
        this.updateBulkActionState(checkboxes[0].closest('form'));
    }

    updateBulkActionState(form) {
        const checkedItems = form.querySelectorAll('[data-bulk-item]:checked');
        const bulkActionSelect = form.querySelector('[data-bulk-action]');
        const bulkSubmitBtn = form.querySelector('[data-bulk-submit]');
        const selectAllCheckbox = form.querySelector('[data-select-all]');

        if (bulkActionSelect && bulkSubmitBtn) {
            bulkActionSelect.disabled = checkedItems.length === 0;
            bulkSubmitBtn.disabled = checkedItems.length === 0;
        }

        if (selectAllCheckbox) {
            const allItems = form.querySelectorAll('[data-bulk-item]');
            selectAllCheckbox.indeterminate = checkedItems.length > 0 && checkedItems.length < allItems.length;
            selectAllCheckbox.checked = checkedItems.length === allItems.length && allItems.length > 0;
        }
    }

    handleBulkAction(form) {
        const checkedItems = form.querySelectorAll('[data-bulk-item]:checked');
        const bulkActionSelect = form.querySelector('[data-bulk-action]');
        
        if (checkedItems.length === 0) {
            this.showToast('Please select at least one item', 'warning');
            return;
        }

        const action = bulkActionSelect.value;
        if (!action) {
            this.showToast('Please select an action', 'warning');
            return;
        }

        const itemIds = Array.from(checkedItems).map(checkbox => checkbox.value);
        const contentType = form.dataset.contentType;

        // Confirm destructive actions
        const destructiveActions = ['delete'];
        if (destructiveActions.includes(action)) {
            if (!confirm(`Are you sure you want to ${action} ${itemIds.length} item(s)?`)) {
                return;
            }
        }

        this.submitBulkAction(contentType, action, itemIds);
    }

    submitBulkAction(contentType, action, itemIds) {
        fetch('/admin-dashboard/ajax/bulk-action/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': this.getCSRFToken()
            },
            body: JSON.stringify({
                content_type: contentType,
                action: action,
                item_ids: itemIds
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                this.showToast(`Successfully ${action}ed ${data.affected_count} item(s)`, 'success');
                setTimeout(() => {
                    location.reload();
                }, 1000);
            } else {
                this.showToast(data.error || 'An error occurred', 'error');
            }
        })
        .catch(error => {
            console.error('Bulk action error:', error);
            this.showToast('An error occurred while processing the action', 'error');
        });
    }

    // Form Handlers
    initializeFormHandlers() {
        // AJAX form submissions
        const ajaxForms = document.querySelectorAll('[data-ajax-form]');
        ajaxForms.forEach(form => {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.submitAjaxForm(form);
            });
        });

        // Auto-save forms
        const autoSaveForms = document.querySelectorAll('[data-auto-save]');
        autoSaveForms.forEach(form => {
            this.initializeAutoSave(form);
        });
    }

    submitAjaxForm(form) {
        const formData = new FormData(form);
        const submitBtn = form.querySelector('[type="submit"]');
        
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<span class="loading-spinner"></span> Saving...';
        }

        fetch(form.action || window.location.href, {
            method: form.method || 'POST',
            body: formData,
            headers: {
                'X-CSRFToken': this.getCSRFToken()
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                this.showToast(data.message || 'Saved successfully', 'success');
                if (data.redirect) {
                    setTimeout(() => {
                        window.location.href = data.redirect;
                    }, 1000);
                }
            } else {
                this.showToast(data.error || 'An error occurred', 'error');
            }
        })
        .catch(error => {
            console.error('Form submission error:', error);
            this.showToast('An error occurred while saving', 'error');
        })
        .finally(() => {
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.innerHTML = submitBtn.dataset.originalText || 'Save';
            }
        });
    }

    initializeAutoSave(form) {
        let autoSaveTimer;
        const inputs = form.querySelectorAll('input, textarea, select');
        
        inputs.forEach(input => {
            input.addEventListener('input', () => {
                clearTimeout(autoSaveTimer);
                autoSaveTimer = setTimeout(() => {
                    this.autoSaveForm(form);
                }, 2000);
            });
        });
    }

    autoSaveForm(form) {
        const formData = new FormData(form);
        formData.append('auto_save', 'true');

        fetch(form.action || window.location.href, {
            method: 'POST',
            body: formData,
            headers: {
                'X-CSRFToken': this.getCSRFToken()
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                this.showToast('Auto-saved', 'success', 2000);
            }
        })
        .catch(error => {
            console.error('Auto-save error:', error);
        });
    }

    // Modal Handlers
    initializeModalHandlers() {
        const modalTriggers = document.querySelectorAll('[data-modal-trigger]');
        const modalCloses = document.querySelectorAll('[data-modal-close]');
        
        modalTriggers.forEach(trigger => {
            trigger.addEventListener('click', (e) => {
                e.preventDefault();
                const modalId = trigger.dataset.modalTrigger;
                this.openModal(modalId);
            });
        });

        modalCloses.forEach(closeBtn => {
            closeBtn.addEventListener('click', (e) => {
                e.preventDefault();
                const modal = closeBtn.closest('.modal-overlay');
                this.closeModal(modal);
            });
        });

        // Close modal on overlay click
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal-overlay')) {
                this.closeModal(e.target);
            }
        });

        // Close modal on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                const activeModal = document.querySelector('.modal-overlay.active');
                if (activeModal) {
                    this.closeModal(activeModal);
                }
            }
        });
    }

    openModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    }

    closeModal(modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }

    // Search and Filter
    initializeSearchFilters() {
        const searchInputs = document.querySelectorAll('[data-search]');
        const filterSelects = document.querySelectorAll('[data-filter]');

        searchInputs.forEach(input => {
            let searchTimer;
            input.addEventListener('input', () => {
                clearTimeout(searchTimer);
                searchTimer = setTimeout(() => {
                    this.performSearch(input.value);
                }, 500);
            });
        });

        filterSelects.forEach(select => {
            select.addEventListener('change', () => {
                this.applyFilters();
            });
        });
    }

    performSearch(query) {
        const url = new URL(window.location);
        if (query) {
            url.searchParams.set('q', query);
        } else {
            url.searchParams.delete('q');
        }
        url.searchParams.set('page', '1');
        window.location.href = url.toString();
    }

    applyFilters() {
        const url = new URL(window.location);
        const filterSelects = document.querySelectorAll('[data-filter]');
        
        filterSelects.forEach(select => {
            const paramName = select.dataset.filter;
            if (select.value && select.value !== 'all') {
                url.searchParams.set(paramName, select.value);
            } else {
                url.searchParams.delete(paramName);
            }
        });
        
        url.searchParams.set('page', '1');
        window.location.href = url.toString();
    }

    // Drag and Drop
    initializeDragDrop() {
        const dropzones = document.querySelectorAll('.dropzone');
        
        dropzones.forEach(dropzone => {
            dropzone.addEventListener('dragover', (e) => {
                e.preventDefault();
                dropzone.classList.add('drag-over');
            });

            dropzone.addEventListener('dragleave', () => {
                dropzone.classList.remove('drag-over');
            });

            dropzone.addEventListener('drop', (e) => {
                e.preventDefault();
                dropzone.classList.remove('drag-over');
                const files = e.dataTransfer.files;
                this.handleFileUpload(files, dropzone);
            });

            // Click to upload
            dropzone.addEventListener('click', () => {
                const fileInput = document.createElement('input');
                fileInput.type = 'file';
                fileInput.multiple = dropzone.dataset.multiple === 'true';
                fileInput.accept = dropzone.dataset.accept || '*/*';
                
                fileInput.addEventListener('change', () => {
                    this.handleFileUpload(fileInput.files, dropzone);
                });
                
                fileInput.click();
            });
        });
    }

    handleFileUpload(files, dropzone) {
        const formData = new FormData();
        const uploadUrl = dropzone.dataset.uploadUrl;

        Array.from(files).forEach((file, index) => {
            formData.append(`file_${index}`, file);
        });

        formData.append('csrfmiddlewaretoken', this.getCSRFToken());

        fetch(uploadUrl, {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                this.showToast(`Uploaded ${files.length} file(s) successfully`, 'success');
                if (data.refresh) {
                    setTimeout(() => {
                        location.reload();
                    }, 1000);
                }
            } else {
                this.showToast(data.error || 'Upload failed', 'error');
            }
        })
        .catch(error => {
            console.error('Upload error:', error);
            this.showToast('Upload failed', 'error');
        });
    }

    // Tooltips
    initializeTooltips() {
        const tooltipElements = document.querySelectorAll('[data-tooltip]');
        
        tooltipElements.forEach(element => {
            element.addEventListener('mouseenter', (e) => {
                this.showTooltip(e.target);
            });

            element.addEventListener('mouseleave', (e) => {
                this.hideTooltip(e.target);
            });
        });
    }

    showTooltip(element) {
        const tooltipText = element.dataset.tooltip;
        const tooltip = document.createElement('div');
        tooltip.className = 'tooltip';
        tooltip.textContent = tooltipText;
        
        document.body.appendChild(tooltip);
        
        const rect = element.getBoundingClientRect();
        tooltip.style.left = rect.left + (rect.width / 2) - (tooltip.offsetWidth / 2) + 'px';
        tooltip.style.top = rect.top - tooltip.offsetHeight - 8 + 'px';
    }

    hideTooltip(element) {
        const tooltip = document.querySelector('.tooltip');
        if (tooltip) {
            tooltip.remove();
        }
    }

    // Charts
    initializeCharts() {
        // Chart initialization logic would go here
        // This is handled in individual templates for now
    }

    // Utility Methods
    getCSRFToken() {
        const tokenElement = document.querySelector('[name=csrfmiddlewaretoken]');
        return tokenElement ? tokenElement.value : '';
    }

    formatNumber(num) {
        if (num >= 1000000) {
            return (num / 1000000).toFixed(1) + 'M';
        } else if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'K';
        }
        return num.toString();
    }

    formatDate(date) {
        return new Intl.DateTimeFormat('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        }).format(new Date(date));
    }

    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
}

// Global Dashboard instance
const Dashboard = new DashboardJS();

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', Dashboard.init);
} else {
    Dashboard.init();
}
