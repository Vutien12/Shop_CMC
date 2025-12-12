<template>
    <div class="page-breadcrumb-wrapper">
        <div class="page-title-section">
            <h1 class="page-title">{{ title }}</h1>
        </div>
        <div class="breadcrumb-section">
            <nav class="breadcrumb-nav" aria-label="breadcrumb">
                <ol class="breadcrumb-list">
                    <li class="breadcrumb-item">
                        <a 
                            href="#" 
                            class="breadcrumb-link home-link" 
                            @click.prevent="goHome"
                            :title="homeTitle"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none">
                                <path d="M12 18V15" stroke="#292D32" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                                <path d="M10.07 2.81997L3.13999 8.36997C2.35999 8.98997 1.85999 10.3 2.02999 11.28L3.35999 19.24C3.59999 20.66 4.95999 21.81 6.39999 21.81H17.6C19.03 21.81 20.4 20.65 20.64 19.24L21.97 11.28C22.13 10.3 21.63 8.98997 20.86 8.36997L13.93 2.82997C12.86 1.96997 11.13 1.96997 10.07 2.81997Z" stroke="#292D32" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                            </svg>
                        </a>
                    </li>
                    <li class="breadcrumb-separator">
                        <i class="fa fa-angle-right"></i>
                    </li>
                    <template v-for="(item, index) in breadcrumbItems" :key="index">
                        <!-- Separator before each item (except first) -->
                        <li v-if="index > 0" class="breadcrumb-separator">
                            <i class="fa fa-angle-right"></i>
                        </li>
                        
                        <!-- Breadcrumb Item -->
                        <li class="breadcrumb-item">
                            <!-- Clickable link for parent items (not the last one) -->
                            <a 
                                v-if="item.route && index < breadcrumbItems.length - 1"
                                href="#" 
                                class="breadcrumb-link" 
                                @click.prevent="goTo(item.route)"
                            >
                                {{ item.label }}
                            </a>
                            <!-- Non-clickable current page (last item or no route) -->
                            <span v-else class="breadcrumb-current">
                                {{ item.label }}
                            </span>
                        </li>
                    </template>
                </ol>
            </nav>
        </div>
    </div>
</template>

<script>
export default {
    name: 'PageBreadcrumb',
    props: {
        title: {
            type: String,
            required: true
        },
        breadcrumbs: {
            type: Array,
            default: () => []
            // Format: [{ label: 'Products', route: { name: 'admin.products.index' } }]
        },
        homeRoute: {
            type: [String, Object],
            default: () => ({ name: 'admin.dashboard' })
        },
        homeTitle: {
            type: String,
            default: 'Dashboard'
        }
    },
    computed: {
        breadcrumbItems() {
            if (this.breadcrumbs && this.breadcrumbs.length > 0) {
                return this.breadcrumbs;
            }
            // Nếu không có breadcrumbs, chỉ hiển thị title
            return [{ label: this.title }];
        }
    },
    methods: {
        goHome() {
            if (typeof this.homeRoute === 'string') {
                this.$router.push(this.homeRoute);
            } else {
                this.$router.push(this.homeRoute);
            }
        },
        goTo(route) {
            if (typeof route === 'string') {
                this.$router.push(route);
            } else {
                this.$router.push(route);
            }
        }
    }
};
</script>

<style scoped>
.page-breadcrumb-wrapper {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px 20px;
    border-bottom: 1px solid #e9ecef;
    margin-bottom: 20px;
}

.page-title-section {
    flex: 1;
}

.page-title {
    font-size: 22px;
    font-weight: 600;
    color: #2c3e50;
    margin: 0;
    line-height: 1.4;
}

.breadcrumb-section {
    flex-shrink: 0;
}

.breadcrumb-nav {
    display: flex;
    align-items: center;
}

.breadcrumb-list {
    display: flex;
    align-items: center;
    list-style: none;
    margin: 0;
    padding: 0;
    gap: 4px;
}

.breadcrumb-item {
    display: flex;
    align-items: center;
}

.breadcrumb-separator {
    color: #adb5bd;
    font-size: 12px;
    display: flex;
    align-items: center;
    padding: 0 4px;
}

.breadcrumb-link {
    color: #6c757d;
    text-decoration: none;
    font-size: 14px;
    transition: color 0.2s ease;
    display: flex;
    align-items: center;
    padding: 4px 6px;
    border-radius: 4px;
}

.breadcrumb-link:hover {
    color: #495057;
    background-color: #e9ecef;
}

.home-link {
    font-size: 16px;
}

.home-link i {
    font-size: 16px;
}

.breadcrumb-current {
    color: #495057;
    font-size: 14px;
    font-weight: 500;
    padding: 4px 6px;
}

/* Responsive Design */
@media (max-width: 768px) {
    .page-breadcrumb-wrapper {
        flex-direction: column;
        align-items: flex-start;
        gap: 10px;
        padding: 12px 15px;
    }

    .page-title {
        font-size: 18px;
    }

    .breadcrumb-link,
    .breadcrumb-current {
        font-size: 13px;
    }

    .home-link i {
        font-size: 14px;
    }

    .breadcrumb-separator {
        font-size: 11px;
        padding: 0 2px;
    }
}

@media (max-width: 480px) {
    .page-title {
        font-size: 16px;
    }

    .breadcrumb-link,
    .breadcrumb-current {
        font-size: 12px;
        padding: 2px 4px;
    }
}

/* Dark Mode Support (Optional) */
@media (prefers-color-scheme: dark) {
    .page-breadcrumb-wrapper {
        background: #1a1d23;
        border-bottom-color: #2d3139;
    }

    .page-title {
        color: #e9ecef;
    }

    .breadcrumb-link {
        color: #adb5bd;
    }

    .breadcrumb-link:hover {
        color: #f8f9fa;
        background-color: #2d3139;
    }

    .breadcrumb-current {
        color: #dee2e6;
    }

    .breadcrumb-separator {
        color: #6c757d;
    }
}
</style>
