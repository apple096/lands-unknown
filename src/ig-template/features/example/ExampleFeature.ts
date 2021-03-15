import {DiscreteUpgrade} from "@/ig-template/tools/upgrades/DiscreteUpgrade";
import {UpgradeId} from "@/ig-template/tools/upgrades/UpgradeId";
import {UpgradeType} from "@/ig-template/tools/upgrades/UpgradeType";
import {CurrencyBuilder} from "@/ig-template/features/wallet/CurrencyBuilder";
import {ArrayBuilder} from "@/ig-template/util/ArrayBuilder";
import {CurrencyType} from "@/ig-template/features/wallet/CurrencyType";
import {Features} from "@/ig-template/Features";
import {UpgradesFeature} from "@/ig-template/features/UpgradesFeature";
import {Currency} from "@/ig-template/features/wallet/Currency";
import {ContinuousUpgrade} from "@/ig-template/tools/upgrades/ContinuousUpgrade";
import {SingleLevelUpgrade} from "@/ig-template/tools/upgrades/SingleLevelUpgrade";

export class ExampleFeature extends UpgradesFeature {

    moneyAdditiveUpgrade: DiscreteUpgrade;
    moneyMultiplicativeUpgrade: ContinuousUpgrade;
    singleLevelUpgrade: SingleLevelUpgrade;

    constructor() {
        super('example-feature');

        this.moneyAdditiveUpgrade = new DiscreteUpgrade(
            UpgradeId.MoneyAdditive,
            UpgradeType.Money,
            'Discrete Upgrade',
            20,
            CurrencyBuilder.createArray(ArrayBuilder.fromStartAndStepAdditive(10, 10, 20), CurrencyType.Money),
            ArrayBuilder.fromStartAndStepAdditive(1, 1, 21));
        this.moneyMultiplicativeUpgrade = new ContinuousUpgrade(
            UpgradeId.MoneyMultiplicative,
            UpgradeType.Money,
            'Continuous Upgrade',
            Infinity,
            (level) => {
                return 1 + level;
            }, (level) => {
                return new Currency(level * 10, CurrencyType.Money);
            })

        this.singleLevelUpgrade = new SingleLevelUpgrade(UpgradeId.SingleLevel, UpgradeType.None, 'Single Level', new Currency(1000, CurrencyType.Money), 1);


        this.upgrades = [
            this.moneyAdditiveUpgrade,
            this.moneyMultiplicativeUpgrade,
            this.singleLevelUpgrade
        ]
    }

    initialize(features: Features) {
        this._wallet = features.wallet;
    }

    update(delta: number) {
        this._wallet.gainCurrency(new Currency(this.moneyPerSecond() * delta, CurrencyType.Money));
    }

    moneyPerSecond(): number {
        return this.moneyAdditiveUpgrade.getBonus() * this.moneyMultiplicativeUpgrade.getBonus();
    }

}