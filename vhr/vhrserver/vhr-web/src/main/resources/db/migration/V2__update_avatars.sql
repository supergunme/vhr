-- 将所有用户头像替换为本地动物头像
UPDATE `hr` SET `userface` = '/avatars/cat.svg' WHERE `id` = 3;
UPDATE `hr` SET `userface` = '/avatars/dog.svg' WHERE `id` = 5;
UPDATE `hr` SET `userface` = '/avatars/rabbit.svg' WHERE `id` = 10;
UPDATE `hr` SET `userface` = '/avatars/bear.svg' WHERE `id` = 11;
UPDATE `hr` SET `userface` = '/avatars/bird.svg' WHERE `id` = 12;
