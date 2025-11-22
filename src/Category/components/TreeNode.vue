<template>
    <li class="tree-node" :class="{ 'jstree-closed': !node.expanded && hasChildren, 'jstree-open': node.expanded && hasChildren }">
        <i 
            v-if="hasChildren"
            class="jstree-icon jstree-ocl"
            @click="$emit('toggle', node.id)"
        ></i>
        <a 
            class="jstree-anchor"
            :class="{ selected: node.id === selectedId }"
            @click.prevent="$emit('select', node)"
        >
            <i class="jstree-icon jstree-themeicon"></i>
            {{ node.name }}
        </a>
        
        <ul v-if="hasChildren && node.expanded" class="jstree-children">
            <TreeNode
                v-for="child in node.children"
                :key="child.id"
                :node="child"
                :selected-id="selectedId"
                @select="$emit('select', $event)"
                @toggle="$emit('toggle', $event)"
            />
        </ul>
    </li>
</template>

<script>
import { computed } from 'vue';

export default {
    name: 'TreeNode',
    props: {
        node: {
            type: Object,
            required: true
        },
        selectedId: {
            type: Number,
            default: null
        }
    },
    emits: ['select', 'toggle'],
    setup(props) {
        const hasChildren = computed(() => {
            return props.node.children && props.node.children.length > 0;
        });

        return {
            hasChildren
        };
    }
};
</script>

<style scoped>
.tree-node {
    list-style: none;
    margin: 5px 0;
    position: relative;
}

.jstree-icon {
    display: inline-block;
    width: 18px;
    height: 18px;
    margin-right: 5px;
    vertical-align: middle;
}

.jstree-ocl {
    cursor: pointer;
    background: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18"><path d="M5 7l4 4 4-4" fill="none" stroke="%23666" stroke-width="2"/></svg>') center center no-repeat;
}

.jstree-closed > .jstree-ocl {
    background: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18"><path d="M7 5l4 4-4 4" fill="none" stroke="%23666" stroke-width="2"/></svg>') center center no-repeat;
}

.jstree-themeicon {
    background: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18"><path d="M3 3h5l2 2h5v10H3V3z" fill="%23f0ad4e" stroke="%23d58512" stroke-width="1"/></svg>') center center no-repeat;
}

.jstree-anchor {
    display: inline-block;
    padding: 5px 8px;
    color: #333;
    text-decoration: none;
    cursor: pointer;
    border-radius: 3px;
}

.jstree-anchor:hover {
    background: #f5f5f5;
}

.jstree-anchor.selected {
    background: #e8f4f8;
    color: #0071a1;
    font-weight: 500;
}

.jstree-children {
    list-style: none;
    padding-left: 25px;
    margin: 0;
}
</style>
