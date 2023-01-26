import { expect } from 'chai';
import { describe, it } from 'mocha';
import { unseal } from '../src/unseal';

const dataA: Record<string, string> = {
    '': 'A.Yo7YEpKJtSnsTyO/GbEp4g.ABXCJq85pbFmCh10.7qWjNqwds/DF2c3lyCOc8qTFECL8ZkGeeeq7LfWSrWw',
    '...': 'A.sSd9eY3pQKISjIPXwXrAhg.ABXCJq86pbK6LymR.LYx0ouTaholcgvJ52A85PGlTBOepw6JJdTVb6YjWra4',
    '......': 'highseal://A.kIRHjYe3hH/wqrASGyfQWQ.ABXCJq86pbNhQTO+.Fj2h8+Z03gsc/0uS15KS/MeMWZL7QRcdw8x2H26lqBk',
    '.........': 'A.QkKv98O22b1nYPA40HFELw.ABXCJq86pbQ+WAIw.Gt9lx0z34ua9TGX0CwitakRNe6lWOor9ypBqrCoW7WY',
    '............': 'A.2nSbrtseo6P8ulNNYHj1BQ.ABXCJq86pbV0GCDH.od1SGmP08dQ+URcoqkTSm97saQeNatmZT28fozzyfBY',
    '...............': 'A.OBIou/XSV5Nsl4Wk25Nktg.ABXCJq86pbYbuHNa.RZStTqoBjrEhdvRQSgqJHIJR+wg6WTUNK6VKcXn2Tw8',
    '..................': 'A.r4KuP9yuacKOvOD52gLZ6w.ABXCJq86pbemh2uS.yQrVReU9uOszjWfH4CrTX0fje/YnZPdhjFxXZJBV8fc',
    '.....................': 'A.NNDTO5yPY7PvZHxEH2iQoA.ABXCJq86pbgB5po0.0DISe4Vj1+xKAH35l9acrc1mSQPpzYJCL2lwxqkTM9o',
    '........................': 'A.1QeeBj3rEAIgJDIuZ8/hng.ABXCJq86pblWF2u9.c09bejq4Aku4aG1wwPlFocGRovwoYcxKRjWMzNFSWXU',
    '...........................': 'A.lx0ffEtDP8RcALfAOENtww.ABXCJq86pbr/y19Y.eelYWOSZ1A1fAFOiWNSowCvtaLGMyAiRn0gJvvUvE0E',
    '..............................': 'A.yv8BJmtC7q+EwikbUD8vkw.ABXCJq86pbsHB8bp.YIX2KZvES2T23qsqv6llc2cv+WY/Q4clM3tXEr3kQH0',
    '.................................': 'A.8Sp1HBNZKFhQsjnCZNj2lg.ABXCJq86pbztaVpy.AJ3kkKu3Tj3m/+uL4lyK1RwgFwggwuuUlIx/A7O/m+0BzI67cjaK5g',
    '....................................': 'A.BiWi15Z/VYIzgRnecPV40Q.ABXCJq87pb0CFxfw.WsavU3bcFFxmWMiGE4kZ7kOhXgZtkNObxQuUd/SiYIgNi+3SsSRFpA',
    '.......................................': 'A.oQeUQUgTvsboLEed/Nm/cA.ABXCJq87pb6r8bgC.+7yN12Fi3PY3+lIzTfa/GGVrhYYCuXI0En1IxoyNOF5wIGZXhfhiAw',
    '..........................................': 'A.OeccY11WwWWtFhRNEhr5Ig.ABXCJq87pb+dFlXJ.bFnF4BGXLDaRDjrsI6l1wi9MLGpmdRv8rQPrIy5v1HmHChBnAjLx6UI0gffRmrw4',
    '.............................................': 'A.8C0bJNOoKV10ev3QQqmx4g.ABXCJq87pcAC4RlA.pUK6kVXlSsPYyiYSuVHIzIPVkiF9hlaKTWC0Zs0R5RIQrzXX6T5GfG+2Dp1jS0Mu',
    '................................................': 'A.1NJa27u9mjukMP5eIycrPQ.ABXCJq87pcENUmRP.wsGC5i40LgGxRR56z/hxUXXAt/IIL8kS9ZHLGcpjuI9FevtAGjM0zOnI22XvmAPY2QwLeeBC2e0',
    '...................................................': 'A.nZxw9LLTkwCj93DE385RdA.ABXCJq87pcJ1fP23.MXEUgKVn2NtJ7gX077fvCvFyJoqrvrQiSPI4s6MSfkNnv6kD+Rj2ynvuJSbrqZd2cv+/Bwz6rh0',
    '......................................................': 'A.GoPwB0LDdbYRetIZoStong.ABXCJq87pcNdBY1h.cp0KZBi9vBP35aFaAgH04na2J1ymwG0KdLsXfGAnjGH324RErqf7t52rq3BD4j51a8wmhpezoTg',
    '.........................................................': 'A.w/R8LWw5Nv/ACUzsRIgzcg.ABXCJq87pcTNn87I.LqpwLzy/beRLVPoOOiNViPLu+S+xdpkvxFX93KmWSg6xK+Fib9uTCfnpFJ2RxU4i08Z3pNNgMcFWm4JuOO+ixQ',
    '............................................................': 'A.mMJL1RcULKXeG3BrGigKTA.ABXCJq87pcUXGnfG.GObhB+CaW6fd+4XVWT1PSDxvs3ktlVdReTk8/KhsT8m8fiqnyQhhqxAugiJFUPPMgPhaCB8kY8AdZXV3zgJubg',
    '...............................................................': 'A.J3NhookONcGZDa2h2DK4wg.ABXCJq87pcaXyvoG.UcK3FonzdugzIvsGMViJT3pChz2fE6yTSJnOP6cpW14E2AjQjqSCLqzl/QqPpnjXLlETvYoNZOEC/P0IjoVAEA',
    '..................................................................': 'A.qk0I9dXk/sI62/7QMhqHpA.ABXCJq87pcespvyU.8XGUz08vwO0aAtgHmhFvMzDMfkOJeB6neZwG3aT+HcEydYPeme6jZ0U1gwHJpASxJi1xOduy0FktuvZxf3/xLKsjIe5B8A7/',
    '.....................................................................': 'A.5FImgmJv3T+WBYpyZx6waw.ABXCJq87pcib2HHk.SncdjlbfkrPOm1iKCOZQnQDV3q3reDWro6fIu/YR2KGBw7G3pDMoZt3rqET0Ju969aGs31hNhFPBP3jaVPebt6zUpWXp/e2K',
    '........................................................................': 'A.qCLT6C3bvQDGkzto8ajP0A.ABXCJq87pcnICr3O.Uwce1IRFs3r7yuyVL4VOZKnUAipenfdj8IHZc5PNB/74e5M7JyPxkTkdFVenDJDGmNye4u9ihYCDI+gP9TlGNKbHeSvffR1lHkYAecaRP5c',
};

describe('unsealing depricated', () => {
    describe('version-A seals', () => {
        it('should succeed', () => {
            const secret = 'marabou stork';
            for (const unsealed in dataA) {
                const sealed = dataA[unsealed];
                const result = unseal(sealed, secret);
                expect(unsealed.length).to.be.lessThan(sealed.length);
                expect(result).to.be.an('array');
                expect(result.length).to.equal(2);
                const [err, value] = result;
                expect(err).to.equal(undefined);
                expect(value).to.equal(unsealed);
            }
        });
    });
});
