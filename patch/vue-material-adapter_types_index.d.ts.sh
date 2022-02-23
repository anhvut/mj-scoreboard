cat <<EOF | patch -f -r /dev/null node_modules/vue-material-adapter/types/index.d.ts
81c81
<   setScrollTarget(any): void;
---
>   setScrollTarget(vm: any): void;
EOF
