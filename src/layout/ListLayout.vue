<template>
    <div>
        <Header></Header>

        <Breadcrumb :name="name" :slug="slug" :root="root"></Breadcrumb>
        <LeftSidebar>
            <slot name="left"></slot>
        </LeftSidebar>

        <Main :withoutRight="withoutRight">
            <div class="m-main">
                <slot></slot>
            </div>

            <RightSidebar>
                <slot name="right"></slot>
            </RightSidebar>
            <Footer></Footer>
        </Main>
    </div>
</template>

<script>
export default {
    name: "ListLayout",
    props: {
        name: {
            type: String,
            default: "成就百科"
        },
        slug: {
            type: String,
            default: "achievement"
        },
        root: {
            type: String,
            default: "cj"
        },
        withoutRight: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {}
    }
};
</script>
