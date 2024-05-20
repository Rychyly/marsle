import MatchModel from "../Service/Matcher/Match"
import MatchValue from "../Service/Matcher/MatchValue"
import MatchType from "../Service/Matcher/MatchType"

import Expansion from "./Expansion"
import Tag from "./Tag"

import TagEnum from "../Model/Tag"

export default class Match {
    constructor(private readonly match: MatchModel) {
    }

    public toString(): string {
        return `<span class="guess guess-${this.match.type} ${this.getClassName()}">${this.innerHtml()}</span>`
    }

    private innerHtml(): string {
        switch(this.match.type) {
            case MatchType.name:
                return this.match.target.name
            case MatchType.cost:
                return this.renderCost()
            case MatchType.expansion:
                return new Expansion(this.match.target.expansion).toString()
            case MatchType.type:
                return this.match.target.type
            case MatchType.tags:
                return this.match.target.tags
                    .map((tag: TagEnum): string => new Tag(tag).toString())
                    .join("")
            case MatchType.vp:
                return this.renderVP()
        }
    }

    private renderCost(): string {
        if (this.match.value === MatchValue.full) {
            return this.match.target.cost.toString()
        }

        return `${this.match.target.cost.toString()} ${this.match.value === MatchValue.higher ? "👆" : "👇"}`
    }

    private getClassName(): string {
        if (this.match.type === MatchType.name) {
            return this.match.value === MatchValue.full ? "full-match" : ""
        }

        if (this.match.value === MatchValue.full) {
            return "full-match"
        }

        if (this.match.value === MatchValue.no) {
            return "no-match"
        }

        return "partial-match"
    }

    private renderVP(): string {
        const { vp } = this.match.target

        if (vp === null) {
            return ""
        }

        if (vp.resource) {
            return `${vp.points} / ${vp.resource}`
        }

        return `${vp.points}`
    }
}