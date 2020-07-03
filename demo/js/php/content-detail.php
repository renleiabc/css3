<?php
use yii\helpers\Html;
use yii\bootstrap\ActiveForm;
use backend\assets\AppAsset;

AppAsset::addCss($this, "css/login/login.css");

$this->title = \Yii::t('app', 'Sign In');

$fieldOptions1 = [
    'options' => ['class' => 'form-group has-feedback'],
    'inputTemplate' => "{input}<span class='glyphicon glyphicon-user form-control-feedback'></span>"
];

$fieldOptions2 = [
    'options' => ['class' => 'form-group has-feedback'],
    'inputTemplate' => "{input}<span class='glyphicon glyphicon-lock form-control-feedback'></span>"
];
?>
<div class="bg-cloud">
    <div class="img-left"></div>
    <div class="login-box row" id="ai-login">
        <div class="login-box-body">
            <div class="login-logo">
                <img src="<?= \Yii::t('app', 'logo') ?>" alt="">
                <div><?= \Yii::t('app', 'Simple SEC'); ?></div>
            </div>
            <?php $form = ActiveForm::begin(['id' => 'login-form', 'enableClientValidation' => false]); ?>
            <?= $form
                ->field($model, 'username', $fieldOptions1)
                ->label(false)
                ->textInput(['placeholder' => $model->getAttributeLabel('username')]) ?>
            <?= $form
                ->field($model, 'password', $fieldOptions2)
                ->label(false)
                ->passwordInput(['placeholder' => $model->getAttributeLabel('password')]) ?>
            <div class="sub-button-box row">
                <div class="col-xs-8 login-checkbox">
                    <?= $form->field($model, 'rememberMe')->checkbox(['value' => 0]) ?>
                </div>
                <!-- /.col -->
                <div class="col-xs-12">
                    <?= Html::submitButton(\Yii::t('app', 'Sign In'), ['class' => 'btn btn-primary btn-block btn-flat btn-lg', 'name' => 'login-button']) ?>
                </div>
                <!-- /.col -->
            </div>
            <?php ActiveForm::end(); ?>
        </div>
    </div><!-- /.login-box -->
</div>
