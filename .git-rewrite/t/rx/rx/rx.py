import reflex as rx
from urllib.parse import quote
from .state import AppState


def tab_nav() -> rx.Component:
    return rx.hstack(
        rx.button(
            "Search",
            variant=rx.cond(AppState.active_tab == "search", "solid", "soft"),
            on_click=lambda: AppState.set_tab("search"),
            size="2",
        ),
        rx.button(
            "Lexicon",
            variant=rx.cond(AppState.active_tab == "lexicon", "solid", "soft"),
            on_click=lambda: AppState.set_tab("lexicon"),
            size="2",
        ),
        gap="2",
        width="100%",
    )

def search_bar() -> rx.Component:
    return rx.vstack(
        rx.hstack(
            rx.input(
                placeholder="Enter Pashto text (exact substring)",
                value=AppState.query,
                on_change=AppState.set_query,
                width="100%",
            ),
            rx.select(
                items=["NT", "OT", "All"],
                value=AppState.scope_label,
                on_change=AppState.set_scope_label,
            ),
            rx.button("Search", on_click=AppState.search),
            spacing="3",
            width="100%",
        ),
        rx.divider(),
        align="start",
        width="100%",
    )


def coverage_bar() -> rx.Component:
    chips = rx.foreach(
        AppState.coverage,
        lambda bc: rx.button(
            rx.hstack(
                rx.text(bc[0]),
                rx.text(" - "),
                rx.text(bc[1]),
                align="center",
            ),
            variant=rx.cond(AppState.book_filter == bc[0], "solid", "soft"),
            on_click=AppState.set_book(bc[0]),
            size="2",
        ),
    )
    clear = rx.button(
        "Show all",
        on_click=AppState.clear_filter,
        variant="outline",
        size="2",
    )
    return rx.box(
        rx.hstack(clear, chips, wrap="wrap", gap="2"),
        position="sticky",
        top="56px",
        z_index="10",
        padding_y="8px",
        background_color=rx.color("gray"),
        style={"backdropFilter": "blur(6px)"},
        width="100%",
    )


def results_header() -> rx.Component:
    return rx.hstack(
        rx.cond(
            AppState.query_type == "verse",
            rx.text("1 verse", weight="bold"),
            rx.cond(
                AppState.query_type == "word",
                rx.text(lambda: f"{len(AppState.grammar_occurrences)} occurrences", weight="bold"),
                rx.text(lambda: f"{len(AppState.results)} results", weight="bold"),
            ),
        ),
        rx.spacer(),
        rx.text(
            lambda: "Scope: "
            + (
                "New Testament"
                if AppState.scope == "nt"
                else ("Old Testament" if AppState.scope == "ot" else "Whole Bible")
            )
        ),
        rx.cond(
            AppState.query_type == "word",
            rx.text(lambda: f" · {AppState.grammar_ms} ms"),
            rx.text(lambda: f" · {AppState.search_ms} ms"),
        ),
        rx.cond(
            AppState.book_filter != "",
            rx.text(lambda: " · Book: " + AppState.book_filter),
            rx.fragment(),
        ),
        width="100%",
        align="center",
        padding_y="8px",
    )


def verse_view() -> rx.Component:
    ref = AppState.verse_ref
    text = AppState.verse_text
    audio_url = AppState.audio_url(ref)
    btn_label = rx.cond(AppState.playing_ref == ref, "Hide audio", "Play audio")
    player = rx.cond(
        (AppState.playing_ref == ref) & (audio_url != ""),
        rx.audio(src=audio_url, controls=True, style={"width": "100%"}),
        rx.fragment(),
    )
    return rx.vstack(
        rx.text(ref, weight="bold"),
        rx.box(text, width="100%"),
        rx.hstack(
            rx.cond(
                audio_url != "",
                rx.button(btn_label, on_click=lambda r=ref: AppState.toggle_play(r), size="2"),
                rx.fragment(),
            ),
            align="start",
        ),
        player,
        align="start",
        padding_y="8px",
        width="100%",
    )


def results_list() -> rx.Component:
    def highlight_spans(text: str, q: str) -> list[rx.Component]:
        if not q:
            return [rx.el("span", text)]
        spans: list[rx.Component] = []
        i = 0
        L = len(text)
        qlen = len(q)
        while i < L:
            j = text.find(q, i)
            if j == -1:
                spans.append(rx.el("span", text[i:]))
                break
            if j > i:
                spans.append(rx.el("span", text[i:j]))
            spans.append(
                rx.el(
                    "mark",
                    text[j:j+qlen],
                    style={"backgroundColor": "#fde68a", "padding": "0 2px", "borderRadius": "2px"},
                )
            )
            i = j + qlen
        return spans

    def verse_item(v: dict) -> rx.Component:
        ref = v.get("ref", "")
        text = v.get("text", "")
        audio_url = AppState.audio_url(ref)
        btn_label = rx.cond(AppState.playing_ref == ref, "Hide audio", "Play audio")
        player = rx.cond(
            (AppState.playing_ref == ref) & (audio_url != ""),
            rx.audio(src=audio_url, controls=True, style={"width": "100%"}),
            rx.fragment(),
        )
        return rx.vstack(
            rx.text(ref, weight="bold"),
            rx.box(*highlight_spans(text, AppState.query), width="100%"),
            rx.hstack(
                rx.cond(
                    audio_url != "",
                    rx.button(btn_label, on_click=lambda r=ref: AppState.toggle_play(r), size="2"),
                    rx.fragment(),
                ),
                align="start",
            ),
            player,
            align="start",
            padding_y="8px",
            width="100%",
        )

    # Branch switch: verse vs grammar vs phrase
    N = 50
    body_first = [verse_item(v) for v in AppState.results[:N]]
    body_rest = [verse_item(v) for v in AppState.results[N:]]
    gram_first = [verse_item(v) for v in AppState.grammar_occurrences[:N]]
    gram_rest = [verse_item(v) for v in AppState.grammar_occurrences[N:]]
    return rx.vstack(
        results_header(),
        rx.cond(
            AppState.query_type == "verse",
            verse_view(),
            rx.fragment(),
        ),
        rx.cond(
            AppState.query_type == "word",
            rx.fragment(
                *(
                    gram_first or [rx.text("No occurrences", color=rx.color("gray"))]
                ),
                rx.cond(
                    len(AppState.grammar_occurrences) > N,
                    rx.accordion.root(
                        rx.accordion.item(
                            header=f"Show all ({len(AppState.grammar_occurrences) - N} more)",
                            content=rx.vstack(*gram_rest, align="start", width="100%"),
                            value="more",
                        ),
                        collapsible=True,
                        width="100%",
                    ),
                    rx.fragment(),
                ),
            ),
            rx.fragment(
                *(
                    body_first or [rx.text("No results", color=rx.color("gray"))]
                ),
                rx.cond(
                    len(AppState.results) > N,
                    rx.accordion.root(
                        rx.accordion.item(
                            header=f"Show all ({len(AppState.results) - N} more)",
                            content=rx.vstack(*body_rest, align="start", width="100%"),
                            value="more",
                        ),
                        collapsible=True,
                        width="100%",
                    ),
                    rx.fragment(),
                ),
            ),
        ),
        align="start",
        width="100%",
    )


def search_content() -> rx.Component:
    share = rx.hstack(
        rx.text("Share:"),
        rx.code(AppState.share_path),
        rx.link("Open", href=AppState.share_path, is_external=False),
        spacing="2",
        width="100%",
    )
    return rx.fragment(
        search_bar(),
        coverage_bar(),
        share,
        rx.divider(),
        results_list(),
    )


def lexicon_content() -> rx.Component:
    return rx.vstack(
        rx.text("Lexicon", size="6", weight="bold"),
        rx.text("Coming soon: frequency lists with filters and actions."),
        align="start",
        width="100%",
        padding_y="16px",
    )


def index() -> rx.Component:
    return rx.container(
        rx.color_mode.button(position="top-right"),
        tab_nav(),
        rx.cond(
            AppState.active_tab == "search",
            search_content(),
            lexicon_content(),
        ),
        max_width="1024px",
        padding_y="24px",
    )


app = rx.App()
app.add_page(index, on_load=AppState.load_bible)
